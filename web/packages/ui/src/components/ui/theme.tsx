import token from '@shellagent/tailwind-config/token';

const primaryColor = '#3e5cfa'; // blue-30
const successColor = '#07bc0c'; // --text-success-default

export const sharedTheme = {
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary: primaryColor,
    colorSuccess: successColor,
    colorLink: primaryColor,
    // 这些 tailwind token 暂时没找, 直接在 devtool 里找的
    // borderRadius: 9999,
    controlHeight: 28,
    fontSizeIcon: 12,
  },
  components: {
    Table: {
      headerBg: token.theme.extend.backgroundColor.static,
      headerColor: token.theme.extend.colors.secondary.DEFAULT,
      cellPaddingBlock: 12,
      rowHoverBg: token.theme.extend.colors.surface.hovered,
      rowSelectedHoverBg: token.theme.extend.colors.surface.hovered,
      rowSelectedBg: token.theme.extend.colors.surface.hovered,
    },
  },
};
