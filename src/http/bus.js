import { line as lineApi, station as stationApi, bus as busApi } from './api'
import { fetch } from './index'

export function getAllLines ({lineName} = {}) {
  return fetch(lineApi.getLineAll, {lineName})
}

export function getStationLike ({stationName} = {}) {
  return fetch(stationApi.getStationLike, {stationName})
}

export function getStationLikeMore ({stationName} = {}) {
  return fetch(stationApi.getStationLikeMore, {stationName})
}

export function getBusWaiting ({lineName, isUpDown, stationNum = 1} = {}) {
  return fetch(busApi.getBusWaiting, {lineName, isUpDown, stationNum})
}
