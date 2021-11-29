import React from 'react';
import {
  ContinueReadingSection,
  GeneralHomeSection,
  MangaRecommendationSection,
} from './components';
import {Sections} from './types';

interface Props {
  section: Sections.HomeSection;
}

export default function Section({section}: Props) {
  if (section.type === 'general') {
    return <GeneralHomeSection section={section} />;
  }

  if (section.type === 'continue-reading') {
    return <ContinueReadingSection section={section} />;
  }

  if (section.type === 'manga-recommendation') {
    return <MangaRecommendationSection section={section} />;
  }

  return null;
}
