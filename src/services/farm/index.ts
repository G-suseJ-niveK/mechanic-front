import apiFormClient from '../apiform';

/**
 * * Create farm
 * @param data
 * @returns
 */
function createFarm(data: any) {
  return apiFormClient.post('/farms', data);
}

/**
 * * Create farm media
 * @param data
 * @param farmId
 * @returns AxiosResponse
 */
function createFarmMedia(data: any, farmId: string) {
  return apiFormClient.post(`/farms/${farmId}/medias`, data);
}
/**
 * * List farm media
 *
 * @param farmId
 * @returns AxiosResponse
 */
function listFarmMedia(farmId: string) {
  return apiFormClient.get(`/farms/${farmId}/media_types`);
}

export { createFarm, createFarmMedia, listFarmMedia };
