import {LatLngExpression} from "leaflet";


export interface UGVPoint {
    lat: number;
    lng: number;
}

export interface Waypoint {
    id: number;
    name: string;
    latlng: LatLngExpression;
    editing: boolean;
}
