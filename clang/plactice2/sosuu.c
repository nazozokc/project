#include <stdio.h>

int main(void) {
  int suti;
  printf("整数を入力して下さい＞＞");
  scanf("%d", &suti);

  switch (suti) {
  case 1:
    printf("%dは素数ではありません。\n", suti);
    break;

  case 2:
    printf("%dは素数です。\n", suti);
    break;

  case 3:
    printf("%dは素数です。\n", suti);
    break;

  case 4:
    printf("%dは素数ではありません。\n", suti);
    break;

  case 5:
    printf("%dは素数です。\n", suti);
    break;

  default:
    printf("%dは判定できません。\n", suti);
    break;
  }

  return 0;
}
