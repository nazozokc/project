#include <stdio.h>

int returns(void) { return 0; }

int main(void) {
  int x = returns();

  printf("%d\n", x);

  return 0;
}
