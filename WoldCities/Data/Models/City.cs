using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WoldCities.Data.Models
{
    [Table("Cities")]
    public class City
    {
        public City() 
        { 
        }
        /// <sumary> 
        /// The unique id and primary key for this City
        /// </sumary>
        [Key]
        [Required]
        public int Id { get; set; }
        /// <sumary> 
        /// City name (in UTF8 format)
        /// </sumary>
        public string Name { get; set; }
        /// <sumary> 
        /// City name (in ASCII format)
        /// </sumary>
        public string Name_ASCII { get; set; }
        /// <sumary> 
        /// City latitude
        /// </sumary>
        [Column(TypeName = "decimal(7, 4)")]
        public decimal Lat { get; set; }
        /// <sumary> 
        /// City longitude
        /// </sumary>
        [Column(TypeName = "decimal(7, 4)")]
        public decimal Lon { get; set; }
        /// <sumary> 
        /// Country Id (foreign key)
        /// </sumary>
        [ForeignKey(nameof(Country))]
        public int CountryId { get; set; }
        /// <sumary> 
        /// The Country related to the City
        /// </sumary>
        public virtual Country Country { get; set; }
    }
}
