import React, {ComponentProps, useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {mangaRelationshipTypeInfo} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {
  ContentRating,
  Manga,
  MangaRequestParams,
  Relationship,
} from 'src/api/mangadex/types';
import Banner from './Banner';
import BasicList from './BasicList';
import MangaCollection from './MangaCollection';
import {MangaCollectionDisplay} from './MangaCollection/MangaCollection';
import {MangaListItem} from './MangaCollection/MangaListItem';
import MangaSearchFilters, {
  ContentRatingFilter,
  PublicationDemographicFilter,
  PublicationStatusFitler,
  RenderContext,
} from './MangaSearchFilters';
import MangaThumbnail from './MangaThumbnail';

interface BasicProps {
  relatedManga?: Relationship<Manga>[];
  title?: string;
  description?: string;
  loading?: boolean;
  display?: MangaCollectionDisplay;
}

type MangaThumbnailProps = Omit<
  React.ComponentProps<typeof MangaThumbnail>,
  'manga' | 'onPress'
>;

type Props = BasicProps &
  MangaThumbnailProps &
  Pick<
    ComponentProps<typeof BasicList>,
    'HeaderComponent' | 'HeaderComponentStyle' | 'ListEmptyComponent'
  >;

export default function MangaRelationshipsCollection({
  relatedManga,
  title,
  description,
  display = MangaCollectionDisplay.Images,
  HeaderComponent,
  HeaderComponentStyle,
  ListEmptyComponent,
  ...thumbnailProps
}: Props) {
  const ids = (relatedManga || []).map(manga => manga.id);
  const [manga, setManga] = useState<Manga[]>([]);
  const [filters, setFilters] = useState<MangaRequestParams>({});

  const [get, {loading}] = useLazyGetMangaList();

  const getSubtitle = (manga: Manga) => {
    const related = relatedManga?.find(rel => rel.id === manga.id);
    if (!related?.related) {
      return;
    }

    return mangaRelationshipTypeInfo(related.related).content;
  };

  const renderItem = useCallback(
    (manga: Manga) => {
      switch (display) {
        case MangaCollectionDisplay.List:
          return <MangaListItem manga={manga} />;
        case MangaCollectionDisplay.Images:
          return (
            <MangaThumbnail
              showReadingStatus
              manga={manga}
              {...thumbnailProps}
              subtitle={getSubtitle(manga)}
            />
          );
        default:
          return null;
      }
    },
    [display],
  );

  useEffect(() => {
    get({...filters, ids, limit: ids.length > 100 ? 100 : ids.length}).then(
      res => {
        if (res?.result === 'ok') {
          setManga(res.data);
        }
      },
    );
  }, []);

  return (
    <>
      <MangaSearchFilters filters={filters} onFiltersChange={setFilters}>
        <RenderContext mode="modal">
          <ContentRatingFilter />
          <PublicationStatusFitler />
          <PublicationDemographicFilter />
        </RenderContext>
      </MangaSearchFilters>
      <ScrollView>
        <BasicList
          loading={loading}
          aspectRatio={display === MangaCollectionDisplay.Images ? 1 / 3 : 1}
          data={manga}
          style={{marginHorizontal: 10}}
          itemStyle={{padding: 5}}
          renderItem={renderItem}
          skeletonLength={12}
          // skeletonItem={skeletonItemMarkup}
          // HeaderComponent={headerMarkup}
          // HeaderComponentStyle={HeaderComponentStyle}
          ListEmptyComponent={
            ListEmptyComponent || <Banner>No titles were found</Banner>
          }
        />
      </ScrollView>
    </>
  );
}
