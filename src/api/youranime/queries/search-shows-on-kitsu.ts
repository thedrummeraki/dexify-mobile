import {gql, TypedDocumentNode} from '@apollo/client';
import {YourAnime} from '..';

export interface Variables {
  slugs: Array<string>;
  first: number;
}

export interface Result {
  shows?: YourAnime.AnimeSearchResult[];
}

export default gql`
  query SearchShowsOnKitsu($text: String!) {
    shows: kitsuSearch(text: $text) {
      titles
      canonicalTitle
      slug
      posterImage {
        tiny
        small
        medium
        large
        original
      }
      year
      nsfw
      platforms(regionLocked: true) {
        name
        title
        colour
      }
    }
  }
` as TypedDocumentNode<Result, {text: string}>;
