﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WoldCities.Data;
using WoldCities.Data.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WoldCities.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/Cities
        [HttpGet]
        //[Route("{pageIndex?}/{pageSize?}")]
        public async Task<ActionResult<ApiResult<CityDTO>>> GetCities(
            int pageIndex = 0, int pageSize = 10, 
            string sortColumn = null, string sortOrder = null, 
            string filterColumn = null, string filterQuery = null)
        {
            //Paginado
            //return await _context.Cities
            //    .Skip(pageIndex * pageSize)
            //    .Take(pageSize)
            //    .ToListAsync();

            return await ApiResult<CityDTO>.CreateAsync(
                _context.Cities
                    .Select(c => new CityDTO()
                    { 
                        Id = c.Id,
                        Name = c.Name,
                        Lat = c.Lat,
                        Lon = c.Lon,
                        CountryId = c.CountryId,
                        CountryName = c.Country.Name
                    }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET api/Cities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            return city;
        }

        // POST api/Cities
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<City>> PostCity(City city)
        {
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCity", new { id = city.Id }, city);
        }

        // PUT api/Cities/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCity(int id, City city)
        {
            if(id != city.Id)
            {
                return BadRequest();
            }
            _context.Entry(city).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if(!CityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE api/Cities/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<City>> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if(city == null)
            {
                return NotFound();
            }
            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CityExists(int id)
        {
            return _context.Cities.Any(e => e.Id == id);
        }

        [Authorize]
        [HttpPost]
        [Route("IsDupeCity")]
        public bool IsDupeCity(City city)
        {
            return _context.Cities.Any(
                e => e.Name == city.Name
                && e.Lat == city.Lat
                && e.Lon == city.Lon
                && e.CountryId == city.CountryId
                && e.Id != city.Id
            );
        }
    }
}
