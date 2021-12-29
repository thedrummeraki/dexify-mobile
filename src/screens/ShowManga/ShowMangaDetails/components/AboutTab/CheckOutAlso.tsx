import React from 'react';
import BasicList from 'src/components/BasicList';
import MangaCategoryItem from 'src/components/CategoriesCollection/MangaCategoryItem';
import {useContentRatingFitlers} from 'src/prodivers';
import {useMangaDetails} from '../../ShowMangaDetails';

export default function CheckOutAlso() {
  const {manga} = useMangaDetails();
  const contentRatings = useContentRatingFitlers();

  const relatedMangaSections = MANGA_RELATIONS.filter(relationshipSection =>
    manga.relationships.find(
      relationship => relationshipSection.slug === relationship.related,
    ),
  );

  console.log(relatedMangaSections);

  return (
    <BasicList
      data={relatedMangaSections}
      aspectRatio={1}
      renderItem={section => {
        const ids = manga.relationships
          .filter(relationship => section.slug === relationship.related)
          .map(x => x.id);
        return (
          <MangaCategoryItem
            category={{type: 'manga', title: section.name, ids, contentRatings}}
          />
        );
      }}
    />
  );
}

const MANGA_RELATIONS = [
  {
    slug: 'monochrome',
    name: 'Monochrome',
  },
  {
    slug: 'main_story',
    name: 'Main story',
  },
  {
    slug: 'adapted_from',
    name: 'Adapted from',
  },
  {
    slug: 'based_on',
    name: 'Based on',
  },
  {
    slug: 'prequel',
    name: 'Prequel',
  },
  {
    slug: 'side_story',
    name: 'Side story',
  },
  {
    slug: 'doujinshi',
    name: 'Doujinshi',
  },
  {
    slug: 'same_franshise',
    name: 'Same franshise',
  },
  {
    slug: 'shared_universe',
    name: 'Shared universe',
  },
  {
    slug: 'sequel',
    name: 'Sequel',
  },
  {
    slug: 'spin_off',
    name: 'Spin off',
  },
  {
    slug: 'alternate_story',
    name: 'Alternate story',
  },
  {
    slug: 'preserialization',
    name: 'Preserialization',
  },
  {
    slug: 'colored',
    name: 'Colored',
  },
  {
    slug: 'serialization',
    name: 'Serialization',
  },
];
