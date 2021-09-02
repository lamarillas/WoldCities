using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Threading.Tasks;

namespace WoldCities.Data
{
    public class ApiResult<T>
    {
        ///<summary>
        /// Private constructor called by the CreateAsync method.
        /// </summary>
        private ApiResult(List<T> data, int count, int pageIndex, int pageSize, string sortColumn, string sortOrder, string filterColum, string filterQuery)
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            SortColumns = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColum;
            FilterQuery = filterQuery;
        }
        /// <summary>
        /// Pages and/or sort a IQueryable source.
        /// </summary>
        /// <param name="source">AN IQueryable source of generic</param>
        /// <param name="pageIndex">Zero-based current page index (0 = first page)</param>
        /// <param name="pageSize">The acual size of eache page</param>
        /// <param name="sortColumn">The sorting column name</param>
        /// <param name="sortOrder">The sorting order ("ASC" or "DESC")</param>
        /// <returns>
        /// An objet contained the paged/sorted result and all the relevant paging/sorting navigation info.
        /// </returns>
        public static async Task<ApiResult<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize, 
            string sortColumn = null, string sortOrder = null, string filterColumn = null, string filterQuery = null)
        {
            if(!string.IsNullOrEmpty(filterColumn) 
                && !string.IsNullOrEmpty(filterColumn)
                && IsValidProperty(filterColumn))
            {
                source = source.Where(
                    string.Format("{0}.Contains(@0)",
                    filterColumn),
                    filterQuery);
            }

            var count = await source.CountAsync();

            if(!string.IsNullOrEmpty(sortColumn) && IsValidProperty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder)
                        && sortOrder.ToUpper() == "ASC"
                        ? "ASC"
                        : "DESC";

                source = source.OrderBy(
                    string.Format(
                        "{0} {1}",
                        sortColumn,
                        sortOrder)
                    );

            }

            source = source
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize);


            // Retrieve the SQL query (for debug purposes)
            var sql = source.ToParametrizedSql();
            
            var data = await source.ToListAsync();

            return new ApiResult<T>(
                    data,
                    count,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }
        /// <summary>
        /// Cheks if the given property name exists
        /// to protect against SQL injection attcks
        /// </summary>
        /// <param name="propertyName">Name of a given property</param>
        /// <param name="throwExceptionIfNotFound">Flag if property does not exist</param>
        /// <returns></returns>
        public static bool IsValidProperty(string propertyName, bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(T).GetProperty(
                    propertyName,
                    BindingFlags.IgnoreCase |
                    BindingFlags.Public |
                    BindingFlags.Instance);

            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException(
                        string.Format("Error: Property '{0}' does not exist.", propertyName));
            
            return prop != null;
        }
        /// <summary>
        /// The data result
        /// </summary>
        public List<T> Data { get; private set; }
        /// <summary>
        /// Zero-base index of current page.
        /// </summary>
        public int PageIndex { get; private set; }
        /// <summary>
        /// Number of items contained in each page
        /// </summary>
        public int PageSize { get; private set; }
        /// <summary>
        /// Total items count
        /// </summary>
        public int TotalCount { get; private set; }
        /// <summary>
        /// Total pages count
        /// </summary>
        public int TotalPages { get; private set; }
        /// <summary>
        /// TRUE if the current page has a previous page,
        /// FALSE otherwise
        /// </summary>
        public bool HasPreviousPage
        {
            get
            {
                return (PageIndex > 0); 
            }
        }
        /// <summary>
        /// TRUE if the current page has a next page, FALSE otherwise.
        /// </summary>
        public bool HasNextPage
        {
            get
            {
                return ((PageIndex + 1) < TotalPages);
            }
        }
        /// <summary>
        /// Sorting Column name (or null if none set)
        /// </summary>
        public string SortColumns { get; set; }
        /// <summary>
        /// Sorting Order ("ASC", "DESC" or null if none set)
        /// </summary>
        public string SortOrder { get; set; }
        /// <summary>
        /// Filter column name (or null if none set)
        /// </summary>
        public string FilterColumn { get; set; }
        /// <summary>
        /// Filter Query string
        /// (to be used within the given FilterColumn)
        /// </summary>
        public string FilterQuery { get; set; }
    }
}
