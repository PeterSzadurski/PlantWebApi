using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlantsController : ControllerBase
    {

        private readonly string PlantListFile = AppDomain.CurrentDomain.BaseDirectory + "PlantList.json";

        private readonly ILogger<PlantsController> _logger;

        public PlantsController(ILogger<PlantsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("GetPlantListFromJson")]
        public List<Plant> GetPlantListFromJson()
        {
            System.Diagnostics.Debug.WriteLine("getting list");
            List<Plant> plants;
            using (var stream = System.IO.File.OpenText(PlantListFile))
            {
                plants = JsonConvert.DeserializeObject<List<Plant>>(stream.ReadToEnd());
                stream.Close();
            }
            return plants;
        }


        private void UpdateJson(List<Plant> plants)
        {
            string json = JsonConvert.SerializeObject(plants);
            System.IO.File.WriteAllText(PlantListFile, json);
        }

        /// <summary>
        /// Empty PlantList.json and fill it the initial set of plants for testing. Done on application startup.
        /// </summary>
        /// <returns>The created plants</returns>
        [HttpPut("PutDemoPlants")]
         public List<Plant> PutDemoPlants()
         {
             List<Plant> plants = new List<Plant>();
            System.Diagnostics.Debug.WriteLine("reading");
            // Add Demo Plants
             plants.Add(new Plant { PlantId = Guid.NewGuid(), IsWatering = false, TimeSinceLastWater = DateTime.Now, PlantName = "Tomato #1" });
             plants.Add(new Plant { PlantId = Guid.NewGuid(), IsWatering = false, TimeSinceLastWater = DateTime.Now.AddHours(-6) , PlantName = "Basil #1" });
             plants.Add(new Plant { PlantId = Guid.NewGuid(), IsWatering = false, TimeSinceLastWater = DateTime.Now.AddMinutes(-5), PlantName = "Tomato #2" });

            string json = JsonConvert.SerializeObject(plants);
            System.IO.File.WriteAllText(PlantListFile, json);
            //
            return plants;
         }

        private int WaterPlant(Plant plant) {
            if (plant == null)
            {
                return 404;
            }
            else if (plant.IsWatering || plant.TimeSinceLastWater.AddSeconds(30) >= DateTime.Now)
            {
                return 304;
            }
            else
            {
                return 200;
            }
        }

        [HttpPatch("PatchWaterPlant")]
        public IActionResult PatchWaterPlant(Guid id)
        {
            List<Plant> plants = GetPlantListFromJson();
            var plant = plants.Where(x => x.PlantId == id).FirstOrDefault();
            int plantResult = WaterPlant(plant);
            if (plantResult != 200)
            {
                return StatusCode(plantResult);
            }
            else
            {
                plant.IsWatering = true;
                plant.TimeSinceLastWater = DateTime.Now;
                UpdateJson(plants);
                return Ok(plant);
            }
        }

        [HttpPatch("PatchWaterPlants")]
        public IActionResult PatchWaterPlants(JsonPatchDocument<string> ids)
        {
            List<Plant> plants = GetPlantListFromJson();
            ids.ToString();
            List<Plant> plantOutput = new List<Plant>();
            foreach (var id in ids.Operations)
            {
                var plant = plants.Where(x => x.PlantId.ToString() == id.value.ToString()).FirstOrDefault();
                if(WaterPlant(plant) == 200)
                {
                    plant.IsWatering = true;
                    plant.TimeSinceLastWater = DateTime.Now;
                    plantOutput.Add(plant);
                }
            }
            UpdateJson(plants);
            return Ok(plantOutput);

        }


    }
}

