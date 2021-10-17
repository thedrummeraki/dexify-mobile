import {UICategory} from './types';

export function useHomeCategories(): UICategory[] {
  return [
    {
      title: 'Currently reading',
      type: 'manga',
      requiresAuth: true,
      url: 'https://api.mangadex.org/manga/status?status=reading&limit=10',
    },
    {
      title: 'Most popular titles',
      type: 'manga',
      description: 'Most popular manga on Mangadex.',
      url: 'https://api.mangadex.org/manga?order%5BfollowedCount%5D=desc&limit=20&includes[]=cover_art',
    },
    {
      title: 'Fall 2021 Seasonal manga',
      type: 'manga',
      description: 'These titles have an anime airing this season.',
      ids: [
        '2fd759fc-0c29-490b-86cc-0997c3f99936',
        '040598d9-5d22-4573-9cb9-b0aaecdc5c7f',
        '7e2933d2-8587-4c0f-b69c-4233864b96a8',
        '08fdede5-9b86-4484-80b0-45593908fda0',
        'bb0e0b80-113a-4516-8c9e-0df47e004590',
        '6e477e5b-d90c-43be-8324-1516868dfd9c',
        'af1044cd-99c1-4311-9505-1eed27e21cad',
        '44c2cb9b-5bde-4f48-9159-b11d11e36a75',
        'f8e294c0-7c11-4c66-bdd7-4e25df52bf69',
        'b49fd121-19bf-4344-a8e1-d1be7ca04e08',
        '6670ee28-f26d-4b61-b49c-d71149cd5a6e',
        'fc6bbfc4-08f3-432d-914b-7fec244c001e',
        '408e2919-4c44-4245-8783-57ef612bc8ef',
        '1f40b922-6abb-418e-a7e9-cc4d25b21439',
        'd87de001-99dc-440a-a186-0e313bc82a6b',
        'a9739f43-3b2d-4aa1-b306-650f576bc716',
        '4088c3cc-6be2-4fb6-80b5-8d8606f00196',
        'af38f328-8df1-4b4c-a272-e737625c3ddc',
        'c8aebcc7-678e-4682-a727-48febbc325fd',
        '89daf9dc-075a-4aa5-873a-cc76bb287108',
        '4309cb8f-091d-43e3-b601-ff2bc0b2d881',
        '308f0355-fedb-4861-a4e0-56fe35ae61d3',
        '94d7d9fa-47ce-4d40-9cca-7b7016e0fe12',
        '5725100d-81bd-467d-b680-1f4dff43adbd',
        '789642f8-ca89-4e4e-8f7b-eee4d17ea08b',
        'f42f3212-f2fd-4479-9d82-b9c55eaec820',
        'a96676e5-8ae2-425e-b549-7f15dd34a6d8',
        'dc34064e-3cd4-48c4-9ec5-550845b96ffb',
        '50fe4f79-8c94-4052-bf66-2cf87f8efd34',
        'bd6d0982-0091-4945-ad70-c028ed3c0917',
        '7ae7067a-7e68-4bd2-a064-5e3e3c059078',
        '278956f5-4f37-404e-981d-46a171f23279',
        'a8bd2f1b-0bbb-4803-a551-3ca54788ddb8',
      ],
      params: {
        'includes[]': 'cover_art',
        'order[followedCount]': 'desc',
      },
    },
    {
      title: 'Latest chapters',
      type: 'chapter',
      description: 'Check out these newly uploaded chapters.',
      url: 'https://api.mangadex.org/chapter?order%5BpublishAt%5D=desc&limit=4&includes[]=manga',
    },
  ];
}

export function useBrowseCategories(): UICategory[] {
  return [
    {
      title: 'Browse by tag',
      url: 'https://api.mangadex.org/manga/tag',
      type: 'tag',
    },
    {
      title: 'Recently added on Mangadex',
      url: `https://api.mangadex.org/manga?order%5BcreatedAt%5D=desc&includes[]=cover_art&limit=50`,
      type: 'manga',
    },
    {
      title: 'Browse Scanlation groups',
      url: 'https://api.mangadex.org/group',
      type: 'group',
    },
  ];
}
