interface PageImage {
  uri: string;
  width: number;
  height: number;
}

export interface Page {
  image: PageImage;
  number: number;
}

export enum ReaderActionState {
  Initial, // only visible for a couple of seconds, on the first render
  Visible, // visible by user
  Hidden, // hidden by user
}
