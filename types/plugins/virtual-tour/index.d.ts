import { Event } from 'uevent';
import { AbstractPlugin, Position, Viewer, ViewerOptions } from '../..';
import { MarkerProperties } from '../markers';

/**
 * @summary Definition of a single node in the tour
 */
export type VirtualTourNode = {
  id: string;
  panorama: any;
  links?: VirtualTourNodeLink[];
  position?: [number, number, number?];
  panoData?: ViewerOptions['panoData'];
  sphereCorrection?: ViewerOptions['sphereCorrection'];
  name?: string;
  caption?: string;
  description?: string;
  markers?: MarkerProperties[];
};

/**
 * @summary Definition of a link between two nodes
 */
export type VirtualTourNodeLink = {
  nodeId: string;
  name?: string;
  position?: [number, number, number?];
  markerStyle?: VirtualTourMarkerStyle;
  arrowStyle?: VirtualTourArrowStyle;
};

/**
 * @summary Style of the arrow in 3D mode
 */
export type VirtualTourArrowStyle = {
  color?: string;
  hoverColor?: string;
  outlineColor?: number;
  /**
   * @deprecated
   */
  opacity?: number;
  scale?: [number, number];
};

/**
 * @summary Style of the marker in markers mode
 */
export type VirtualTourMarkerStyle = Omit<MarkerProperties, 'id' | 'longitude' | 'latitude' | 'polygonPx' | 'polygonRad' | 'polylinePx' | 'polylineRad' | 'tooltip' | 'content' | 'hideList' | 'visible' | 'data'>;

/**
 * @summary Data associated to the "node-changed" event
 */
export type VirtualTourNodeChangedData = {
  fromNode?: VirtualTourNode,
  fromLink?: VirtualTourNodeLink,
  fromLinkPosition?: Position,
};

export type VirtualTourPluginOptions = {
  dataMode?: 'client' | 'server';
  positionMode?: 'manual' | 'gps';
  renderMode?: '3d' | 'markers';
  nodes?: VirtualTourNode[];
  getNode?: (nodeId: string) => VirtualTourNode | Promise<VirtualTourNode>;
  /**
   * @deprecated
   */
  getLinks?: (nodeId: string) => VirtualTourNodeLink[] | Promise<VirtualTourNodeLink[]>;
  startNodeId?: string;
  preload?: boolean | ((node: VirtualTourNode, link: VirtualTourNodeLink) => boolean);
  rotateSpeed?: boolean | string | number;
  transition?: boolean | number;
  markerStyle?: VirtualTourMarkerStyle;
  arrowStyle?: VirtualTourArrowStyle;
  markerLatOffset?: number;
  arrowPosition?: 'top' | 'bottom';
};

/**
 * @deprecated Use VirtualTourPluginOptions
 */
export type VirtualTourPluginPluginOptions = VirtualTourPluginOptions;

export const EVENTS: {
  NODE_CHANGED: 'node-changed',
  RENDER_NODES_LIST: 'render-nodes-list',
};

export const MODE_CLIENT = 'client';
export const MODE_SERVER = 'server';
export const MODE_MANUAL = 'manual';
export const MODE_GPS = 'gps';
export const MODE_MARKERS = 'markers';
export const MODE_3D = '3d';

/**
 * @summary Replaces the standard autorotate animation by a smooth transition between multiple points
 */
export class VirtualTourPlugin extends AbstractPlugin {

  static EVENTS: typeof EVENTS;
  static MODE_CLIENT: typeof MODE_CLIENT;
  static MODE_SERVER: typeof MODE_SERVER;
  static MODE_3D: typeof MODE_3D;
  static MODE_MARKERS: typeof MODE_MARKERS;
  static MODE_MANUAL: typeof MODE_MANUAL;
  static MODE_GPS: typeof MODE_GPS;

  constructor(psv: Viewer, options: VirtualTourPluginOptions);

  /**
   * @summary Sets the nodes (client mode only)
   */
  setNodes(nodes: VirtualTourNode[], startNodeId?: string);

  /**
   * @summary Changes the current node
   * @returns resolves false if the loading was aborted by another call
   */
  setCurrentNode(nodeId: string): Promise<boolean>;

  /**
   * @summary Toggles the visibility of the list of nodes
   */
  toggleNodesList();

  /**
   * @summary Opens side panel with the list of nodes
   */
  showNodesList();

  /**
   * @summary Closes side panel if it contains the list of nodes
   */
  hideNodesList();

  /**
   * @summary Triggered when the current node changes
   */
  on(e: 'node-changed', cb: (e: Event, nodeId: VirtualTourNode['id'], data: VirtualTourNodeChangedData) => void): this;

  /**
   * @summary Used to alter the list of nodes displayed on the side-panel
   */
  on(e: 'render-nodes-list', cb: (e: Event, nodes: VirtualTourNode[]) => VirtualTourNode[]): this;

}
