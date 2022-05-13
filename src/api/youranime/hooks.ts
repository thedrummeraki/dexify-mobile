import {useLazyQuery} from '@apollo/client';
import GetShowQuery from './queries/get-show';
import GetNextEpisode from './queries/get-show-next-episode';

export function useYourAnimeShow() {
  return useLazyQuery(GetShowQuery);
}

export function useNextEpisodeForShow() {
  return useLazyQuery(GetNextEpisode);
}
