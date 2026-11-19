#include <stdio.h>

int main(void) {
  int x, mt, shoji;

  printf("最初の所持金を入力＞＞");
  scanf("%d", &x);

  mt = 0;
  shoji = x;

  while (shoji >= 20000) {
    mt += 1;
    shoji += (int)(3000 + (shoji * 0.5));
  }

  printf("最初の所助金が%d円の場合は\n", x);
  printf("%dヶ月後に%d円です\n", mt, shoji);
  return 0;
}
