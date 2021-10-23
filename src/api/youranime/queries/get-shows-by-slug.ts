import {gql, TypedDocumentNode} from '@apollo/client';
import {YourAnime} from '..';

export interface Variables {
  slugs: Array<string>;
  first: number;
}

export interface Result {
  shows?: YourAnime.GraphQL.Connection<YourAnime.AnimeSearchResult>;
}

export default gql`
  query GetShowsBySlug($slugs: [String!]!, $first: Int!) {
    shows(slugs: $slugs, first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
      }

      edges {
        cursor
        node {
          ageRating {
            rating
            guide
          }
          airingAt
          description
          endedOn
          episodesCount
          friendlyStatus
          likes
          otherLinks {
            value
            urlType
            color
          }
          nsfw
          nextEpisode
          platforms(regionLocked: true) {
            name
          }
          popularity
          popularityPercentage
          posterUrl
          relativePopularity
          showType
          showCategory
          slug
          startsOn
          status
          tags {
            value
          }
          title
          titleRecord {
            en
            jp
          }
          year
          youtubeTrailerUrl
        }
      }
    }
  }
` as TypedDocumentNode<Result, Variables>;
