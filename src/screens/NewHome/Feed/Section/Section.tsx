import React from 'react';
import {
  ContinueReadingSection,
  GeneralHomeSection,
  MangaRecommendationSection,
} from './components';
import ChaptersSection from './components/ChaptersSection';
import {Sections} from './types';

interface Props {
  section: Sections.HomeSection;
}

export default function Section({section}: Props) {
  if (section.type === 'general') {
    return (
      <GeneralHomeSection hideIfEmpty={section.hideIfEmpty} section={section} />
    );
  }

  if (section.type === 'continue-reading') {
    return <ContinueReadingSection section={section} />;
  }

  if (section.type === 'manga-recommendation') {
    return <MangaRecommendationSection section={section} />;
  }

  if (section.type === 'chapters-list') {
    return <ChaptersSection section={section} />;
  }

  return null;
}
