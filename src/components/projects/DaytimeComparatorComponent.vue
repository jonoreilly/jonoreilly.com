<script lang="ts">
import { defineComponent } from "vue";

type Location = {
  id: number;
  hoursOffset: number;
  city: string;
  country: string;
};

const locations: Location[] = [
  {
    id: 1,
    hoursOffset: 0,
    city: "London",
    country: "United Kingdom",
  },
  {
    id: 2,
    hoursOffset: 1,
    city: "Berlin",
    country: "Germany",
  },
  {
    id: 3,
    hoursOffset: 2,
    city: "Bucharest",
    country: "Romania",
  },
  {
    id: 4,
    hoursOffset: -1,
    city: "Reykjavik",
    country: "Iceland",
  },
  {
    id: 5,
    hoursOffset: -6,
    city: "Mexico city",
    country: "Mexico",
  },
  {
    id: 6,
    hoursOffset: 9,
    city: "Tokyo",
    country: "Japan",
  },
  {
    id: 7,
    hoursOffset: 10,
    city: "Sydney",
    country: "Australia",
  },
  {
    id: 8,
    hoursOffset: 5,
    city: "Mumbai",
    country: "India",
  },
];

const currentHour = new Date().getUTCHours();

export default defineComponent({
  data() {
    return {
      locations,
      selectedLocationIds: [] as number[],
      newLocationVModel: undefined as number | undefined,
    };
  },

  computed: {
    selectedLocations(): (Location | undefined)[] {
      return this.selectedLocationIds.map((id) =>
        locations.find((location) => location.id === id)
      );
    },
  },

  methods: {
    setNewLocationVModel(value: string | undefined) {
      console.log(value);

      const parsedValue = Number(value);

      if (!Number.isNaN(parsedValue)) {
        this.newLocationVModel = parsedValue;

        this.selectedLocationIds.push(parsedValue);

        this.newLocationVModel = undefined;
      }
    },

    getHour(value: number, offset: number) {
      return (value + offset + 24) % 24;
    },
  },
});
</script>

<template>
  <div>
    <div class="grid">
      <!-- UTC -->
      <div>UTC</div>
      <div v-for="i in 24" :key="i">
        {{ i }}
      </div>

      <!-- Locations -->
      <template v-for="(location, i) in selectedLocations" :key="location.id">
        <div>
          <select v-model="selectedLocationIds[i]">
            <option
              v-for="location in locations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.city }}, {{ location.country }}
            </option>
          </select>
        </div>
        <div
          v-for="i in 24"
          :key="i"
          :data-hour="getHour(i, location.hoursOffset)"
        >
          {{ getHour(i, location.hoursOffset) }}
        </div>
      </template>

      <!-- Add new location -->
      <select
        :value="newLocationVModel"
        @change="setNewLocationVModel($event.target.value)"
      >
        <option value="" hidden disabled selected>Add a new location</option>

        <option
          v-for="location in locations"
          :key="location.id"
          :value="location.id"
        >
          {{ location.city }}, {{ location.country }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: auto repeat(24, auto);
  gap: 4px;
  padding: 10px;
}

[data-hour="0"] {
  background-color: #005;
}

[data-hour="1"] {
  background-color: #005;
}

[data-hour="2"] {
  background-color: #005;
}

[data-hour="3"] {
  background-color: #005;
}

[data-hour="4"] {
  background-color: #005;
}

[data-hour="5"] {
  background-color: #339;
}

[data-hour="6"] {
  background-color: #339;
}

[data-hour="7"] {
  background-color: #339;
}

[data-hour="8"] {
  background-color: #339;
}

[data-hour="9"] {
  background-color: #339;
}

[data-hour="10"] {
  background-color: #fd8;
}

[data-hour="11"] {
  background-color: #fd8;
}

[data-hour="12"] {
  background-color: #fd8;
}

[data-hour="13"] {
  background-color: #fd8;
}

[data-hour="14"] {
  background-color: #fd8;
}

[data-hour="15"] {
  background-color: #fd8;
}

[data-hour="16"] {
  background-color: #fd8;
}

[data-hour="17"] {
  background-color: #fd8;
}

[data-hour="18"] {
  background-color: #339;
}

[data-hour="19"] {
  background-color: #339;
}

[data-hour="20"] {
  background-color: #339;
}

[data-hour="21"] {
  background-color: #339;
}

[data-hour="22"] {
  background-color: #005;
}

[data-hour="23"] {
  background-color: #005;
}

[data-hour="24"] {
  background-color: #005;
}
</style>
