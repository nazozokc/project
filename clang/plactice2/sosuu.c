#include <stdio.h>
int main(void) {
  int suti;

  printf("数値を入力＞＞");
  scanf("%d", &suti);

  switch (suti) {
  case 2:
    printf("2です。");
    break;
  }

  return 0;
}
