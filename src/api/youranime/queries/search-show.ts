import {gql, TypedDocumentNode} from '@apollo/client';
import {YourAnime} from '..';

export interface Variables {
  slug: string;
}

export interface Result {
  show?: YourAnime.Anime;
}

export default gql`
  query SearchShow($query: String!, limit: Int!) {
    search(query: $query, first: $limit, limit: $limit) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        totalCount
      }

      nodes {
        ageRating {
          rating
          guide
        }
        episodesCount
        nextEpisode
        popularityPercentage
      }
    }
    show(slug: $slug) {
      airingAt
      description
      endedOn
      episodesCount
      friendlyStatus
      likes
      links(regionLocked: true) {
        value
        urlType
        platform {
          icon
          title
          name
          colour
          image
          url
        }
      }
      otherLinks {
        value
        urlType
        color
      }
      nsfw
      nextEpisode
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
` as TypedDocumentNode<Result, Variables>;
