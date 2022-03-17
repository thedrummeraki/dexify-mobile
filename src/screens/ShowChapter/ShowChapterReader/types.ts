interface PageImage {
  uri: string;
  width: number;
  height: number;
}

export interface Page {
  image: PageImage;
  number: number; // the visual identifier for the page (ie: volume number)
  position: number; // the actual position of the page (ie: index of the page)
}

export enum ReaderActionState {
  Initial, // only visible for a couple of seconds, on the first render
  Visible, // visible by user
  Hidden, // hidden by user
}
