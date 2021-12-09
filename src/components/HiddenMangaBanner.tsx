import React from 'react';
import {Banner} from 'src/components';

export default function HiddenMangaBanner() {
  return (
    <Banner title="Hidden titles">
      Some titles may not be visible due to your content-rating filters.
    </Banner>
  );
}
