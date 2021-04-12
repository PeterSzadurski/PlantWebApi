using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Backend.Models
{
    [Serializable]
    public class Plant
    {
        [JsonPropertyName("PlantId")]
        public Guid PlantId { get; set; }
        [JsonPropertyName("PlantName")]
        public string PlantName { get; set; }
        [JsonPropertyName("TimeSinceLastWater")]
        public DateTime TimeSinceLastWater { get; set; }
        [JsonPropertyName("StartTimeOfCurrentWater")]
        public DateTime StartTimeOfCurrentWater { get; set; }
        [JsonPropertyName("IsWatering")]
        public bool IsWatering { get; set; }
    }
}
