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
            // make sure the isWatering is up to date
            DateTime date = DateTime.Now;
            foreach(var p  in plants)
            {
                if (p.IsWatering)
                {
                    if ((date - p.StartTimeOfCurrentWater).TotalSeconds > 10) {
                        p.IsWatering = false;
                        p.TimeSinceLastWater = p.StartTimeOfCurrentWater;
                    }
                }
            }
            UpdateJson(plants);

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
             plants.Add(new Plant { PlantId = Guid.NewGuid(), IsWatering = false, TimeSinceLastWater = DateTime.Now.AddMinutes(-20), PlantName = "Cactus #1" });
             plants.Add(new Plant { PlantId = Guid.NewGuid(), IsWatering = false, TimeSinceLastWater = DateTime.Now.AddMinutes(-30), PlantName = "Daisy #1" });

            UpdateJson(plants);
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
      

        [HttpPatch("PatchCancelWater")]
        public IActionResult PatchCancelWater(string plantId)
        {
            List<Plant> plants = GetPlantListFromJson();
            var plant = plants.Where(x => x.PlantId.ToString() == plantId).FirstOrDefault();
            plant.IsWatering = false;
            plant.StartTimeOfCurrentWater = plant.TimeSinceLastWater;
            UpdateJson(plants);
            return Ok(plants);

        }


        [HttpPatch("PatchWaterPlants")]
        public IActionResult PatchWaterPlants(JsonPatchDocument<string> ids)
        {
            List<Plant> plants = GetPlantListFromJson();
            ids.ToString();
            foreach (var id in ids.Operations)
            {
                var plant = plants.Where(x => x.PlantId.ToString() == id.value.ToString()).FirstOrDefault();
                if(WaterPlant(plant) == 200)
                {   
                    plant.IsWatering = true;
                    plant.StartTimeOfCurrentWater = DateTime.Now;
                }
            }
            UpdateJson(plants);
            return Ok(plants);

        }


    }
}

