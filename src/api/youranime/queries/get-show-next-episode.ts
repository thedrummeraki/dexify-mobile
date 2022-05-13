import {gql, TypedDocumentNode} from '@apollo/client';
import {YourAnime} from '..';

export interface Variables {
  slug: string;
}

export interface Result {
  nextAiringEpisode?: YourAnime.AiringSchedule | null;
}

export default gql`
  query GetShow($slug: String!) {
    nextAiringEpisode(slug: $slug) {
      airingAt
      timeUntilAiring
      episodeNumber
    }
  }
` as TypedDocumentNode<Result, Variables>;
