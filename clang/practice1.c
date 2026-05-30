#include <stdio.h>
int main(void) {
  int suu1, suu2, kekka1;
  double jsuu1, jsuu2, kekka2;

  suu1 = 2;
  suu2 = 3;
  kekka1 = suu1 + suu2;

  jsuu1 = 2.344;
  jsuu2 = 3.455;
  kekka2 = jsuu1 + jsuu2;

  printf("%d+%d=%d\n", suu1, suu2, kekka1);
  printf("%d+%d=%3d\n", suu1, suu2, kekka1);
  printf("%lf+%lf=%lf\n", jsuu1, jsuu2, kekka2);
  printf("%lf+%lf=%5.2lf\n", jsuu1, jsuu2, kekka2);

  return 0;
}
