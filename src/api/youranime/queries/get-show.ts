import {gql, TypedDocumentNode} from '@apollo/client';
import {YourAnime} from '..';

export interface Variables {
  slug: string;
}

export interface Result {
  show?: YourAnime.Anime;
}

export default gql`
  query GetShow($slug: String!) {
    show(slug: $slug) {
      ageRating {
        rating
        guide
      }
      airingAt
      bannerUrl
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
      titles
      titleRecord {
        en
        jp
      }
      year
      youtubeTrailerUrl
    }
  }
` as TypedDocumentNode<Result, Variables>;
