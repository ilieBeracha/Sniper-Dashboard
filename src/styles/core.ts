const WHITE = {
  white: "#FFFFFF",
};

const GREYS = {
  grey900: "#121212",

  grey800: "#2D2D2D",

  grey700: "#424242",

  grey600: "#585858",

  grey500: "#7B7B7B",

  grey400: "#B0B0B0",

  grey300: "#D0D0D0",

  grey200: "#E7E7E7",

  grey100: "#EFEFEF",

  grey50: "#E7E7E7",

  grey25: "#f9f9f9",

  grey10: "#fcfcfc",

  grey0: "#ffffff",
};

const BLUES = {
  blue600: "#004BCC",

  blue500: "#005EFF",

  blue400: "#337EFF",

  blue300: "#6699FF",

  blue200: "#99BBFF",

  blue150: "#B2CCFF",

  blue100: "#CCDDFF",

  blue50: "#E5EFFF",

  blue25: "#F5F8FF",
};

const GREENS = {
  green600: "#1E943D",

  green500: "#27BF4F",

  green400: "#40D868",

  green300: "#6BE18A",

  green200: "#95E9AB",

  green100: "#BFF2CD",

  green50: "#EAFBEE",

  green25: "#F7FDF8",
};

const YELLOWS = {
  yellow600: "#CC7700",

  yellow500: "#FFB800",

  yellow400: "#FFD466",

  yellow300: "#FFD466",

  yellow200: "#FFE299",

  yellow100: "#FFF0CC",

  yellow50: "#FFFBF0",

  yellow25: "#FFFCF5",
};

const ORANGES = {
  orange600: "#C75505",

  orange500: "#F96A06",

  orange400: "#FAA038",

  orange300: "#FBB86A",

  orange200: "#FCCF9C",

  orange100: "#FEE7CD",

  orange50: "#FEF0E6",

  orange25: "#FFF9F5",
};

const REDS = {
  red600: "#8C0D0F",

  red500: "#BB1114",

  red400: "#EA1519",

  red300: "#F27375",

  red200: "#F6A2A3",

  red150: "#F8B9BA",

  red100: "#F8B9BA",

  red50: "#FDE8E8",

  red25: "#FEF6F6",
};

const ACCENT = {
  accent900: "#121212",

  accent800: "#2D2D2D",

  accent700: "#424242",

  accent600: "#585858",

  accent500: "#B0B0B0",

  accent400: "#B0B0B0",

  accent300: "#D0D0D0",

  accent200: "#E7E7E7",

  accent100: "#EFEFEF",

  accent50: "#E7E7E7",

  accent0: "#FFFFFF",
};

const MINT = {
  mint600: "#00CC96",

  min100: "#2D2D2D",
};

const PINK = {
  pink450: "#FF08C2",

  pink50: "#FFE1F8",
};

const PURPLE = {
  purple400: "#8344EE",

  purple100: "#DFCFFB",

  purple50: "#EFE8FD",

  purple25: "#F9F6FE",
};

const LAVENDER = {
  lavender400: "#6275D7",

  lavender100: "#6B7FFF",

  lavender50: "#CCD3FF",

  lavender25: "#F0F2FF",
};

const TEAL = {
  pink450: "#18BFFF",

  pink50: "#E3F7FF",
};

//TODO-DS we need to change this color

const NAVIGATION = {
  secondary150: "#C5F3C7",

  secondary25: "#E0F9E1",
};

export const primitives = {
  grey: GREYS,

  blue: BLUES,

  green: GREENS,

  yellow: YELLOWS,

  orange: ORANGES,

  red: REDS,

  accent: ACCENT,

  mint: MINT,

  purple: PURPLE,

  lavender: LAVENDER,

  pink: PINK,

  teal: TEAL,

  navigation: NAVIGATION,

  white: WHITE,
};

export const backgrounds = {
  primary: {
    default: primitives.white.white,

    hover: primitives.grey.grey50,

    selected: primitives.grey.grey50,

    disabled: primitives.grey.grey50,

    loading: primitives.grey.grey50,

    inverted: primitives.grey.grey50,

    accent: primitives.grey.grey50,

    focus: primitives.grey.grey50,
  },

  secondary: {
    default: primitives.grey.grey100,

    accent: primitives.navigation.secondary150,
  },

  informative: {
    default: primitives.blue.blue25,
  },

  danger: { default: primitives.grey.grey50 },

  success: { default: primitives.grey.grey50 },

  insight: { default: primitives.grey.grey50 },

  warning: { default: primitives.grey.grey50 },
};

export const borders = {
  interactive: {
    default: primitives.grey.grey300,

    hover: primitives.accent.accent900,

    focus: primitives.accent.accent900,

    selected: primitives.accent.accent900,

    disabled: primitives.grey.grey300,

    error: primitives.red.red600,
  },

  secondary: {
    default: primitives.grey.grey300,
  },

  tertiary: {
    default: primitives.grey.grey100,
  },

  informative: {
    default: primitives.blue.blue150,
  },

  danger: { default: primitives.red.red150 },

  success: { default: primitives.grey.grey50 },

  insight: { default: primitives.grey.grey50 },

  warning: { default: primitives.grey.grey50 },
};

export const text = {
  primary: {
    default: primitives.grey.grey900,
  },

  secondary: {
    default: primitives.grey.grey800,
  },

  tertiary: {
    default: primitives.grey.grey700,
  },

  subtle: {
    default: primitives.grey.grey600,
  },

  placeholder: { default: primitives.grey.grey400 },

  helper: { default: primitives.grey.grey500 },

  disabled: { default: primitives.grey.grey400 },

  loading: { default: primitives.grey.grey400 },

  accent: { default: primitives.grey.grey900 },

  error: { default: primitives.grey.grey500 },

  inverted: { default: primitives.grey.grey0 },
};

export const icons = {
  primary: {
    default: primitives.accent.accent0,

    disabled: primitives.accent.accent400,
  },

  secondary: {
    default: primitives.accent.accent900,

    disabled: primitives.grey.grey400,
  },

  tertiary: {
    default: primitives.accent.accent900,

    disabled: primitives.grey.grey400,
  },

  destructive: {
    default: primitives.grey.grey0,

    disabled: primitives.accent.accent400,
  },
};

export const spacings = {
  spacing0: "0",

  spacing1: "4px",

  spacing2: "8px",

  spacing3: "12px",

  spacing4: "16px",

  spacing5: "24px",

  spacing6: "32px",

  spacing7: "40px",

  spacing8: "48px",

  spacing9: "56px",

  spacing10: "64px",

  spacing11: "72px",

  spacing12: "80px",
};

export const radius = {
  radius0: "0",

  radius1: "4px",

  radius2: "6px",

  radius3: "8px",

  radius4: "12px",
};

export const core = {
  backgrounds,

  borders,

  spacings,

  radius,

  text,

  icons,
};
