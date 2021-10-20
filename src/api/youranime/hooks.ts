import {useQuery} from '@apollo/client';
import GetShowQuery from './queries/get-show';

export function useYourAnimeShow(slug: string) {
  return useQuery(GetShowQuery, {variables: {slug}});
}
