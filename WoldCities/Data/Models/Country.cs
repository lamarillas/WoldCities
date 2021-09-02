using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WoldCities.Data.Models
{
    [Table("Countries")]
    public class Country
    {
        public Country()
        { 
        }
        /// <sumary> 
        /// The unique id and primary key for this City
        /// </sumary>
        [Key]
        [Required]
        public int Id { get; set; }
        /// <sumary> 
        /// Country name (in UTF8 format)
        /// </sumary>
        public string Name { get; set; }
        /// <sumary> 
        /// Country code (in ISO 3166-1 ALPHA-2 format)
        /// </sumary>
        [JsonPropertyName("iso2")]
        public string ISO2 { get; set; }
        /// <sumary> 
        /// Country code (in ISO 3166-1 ALPHA-3 format)
        /// </sumary>
        [JsonPropertyName("iso3")]
        public string ISO3 { get; set; }
        /// <sumary> 
        /// A list containing all the cities related to this country
        /// </sumary>
        public virtual List<City> Cities { get; set; }
    }
}
