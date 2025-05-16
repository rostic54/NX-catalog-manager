/// ENUMS

export enum PromptTopic {
  BUSINESS = 'BUSINESS',
  TRAVEL = 'TRAVEL',
  FINANCE = 'FINANCE',
  SPORT = 'SPORT',
  INVESTMENT = 'INVESTMENT',
  HUMOR = 'HUMOR',
}

/// INTERFACES

export interface Prompt extends PromptDetails {
  topic: PromptTopic;
}
export interface PromptDetails {
  subTopic: string;
  targetItem: string;
}

export interface TitleSuggestions {
  titleSuggestions: string[];
}

export interface MeetingDetailedInfo {
  facts: string[];
  stats: {
    [key: string]: any;
  };
  image: string;
}
