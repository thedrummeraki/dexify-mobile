import React from "react";
import { View } from "react-native";
import { ContentRating, Manga, ReadingStatus } from "src/api/mangadex/types";
import { UIMangaCategory } from "src/categories";
import { CategoriesCollection } from "src/components";

interface MangaByStatus {
  mangaIds: string[];
}

interface MangaInList {
  title: string;
  id: string;
  mangaIds: string[];
}

interface Props {
  mangaInList: MangaInList[];
  followedMangaIds: string[];
}

export default function LibraryDetails({mangaInList, followedMangaIds}: Props) {
  const mangaByStatusCategories: UIMangaCategory[] = [];

  mangaInList.forEach((info) => {
    mangaByStatusCategories.push({
      type: 'manga',
      ids: info.mangaIds,
      title: info.title,
      viewMore: {
        content: 'View >',
        onAction: () => console.log('open', info.id),
      },
      params: {
        'includes[]': 'cover_art',
        limit: '10',
      },
      contentRatings: [
        ContentRating.safe,
        ContentRating.suggestive,
        ContentRating.erotica,
        ContentRating.pornographic,
      ]
    })
  });

  return <CategoriesCollection categories={mangaByStatusCategories} />
}
