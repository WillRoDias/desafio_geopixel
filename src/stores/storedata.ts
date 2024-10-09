import { reactive } from "vue";

const DEFAULT_COOR = [-45.53, -23.01];

export const useStoreData = reactive({
  cityName: '',
  cityCoord: DEFAULT_COOR,
})
