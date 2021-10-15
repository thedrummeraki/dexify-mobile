import React from 'react';
import {useState} from 'react';
import {Header} from '../foundation';

interface Props {
  title?: string;
  subtitle?: string;
}

export default function DexifyHeader({title, subtitle}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Header
      title={title || 'Dexify'}
      subtitle={subtitle}
      onSearch={setSearchQuery}
    />
  );
}
