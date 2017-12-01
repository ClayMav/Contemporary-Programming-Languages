// -*- mode: c++ -*-
/**
 * \file rotor.cpp
 *
 * \brief Defines the Rotor class
 *
 * Provides a Rotor class that acts as a rotor in OWCA's message
 * decryption program
 */
#include "rotor.h"

Rotor::Rotor(int num)
{
  // Save for when we need to decrypt
  disk = num;

  // Initial shift value
  previous_input = 'A';
}

char Rotor::shift(char input)
{
  return (input + previous_input - 130) % 26 + 65;
}

char Rotor::decrypt(char input)
{
  char shifted = shift(input);
  char output = '\0';

  // Switch based on the disk that we're using. We only need to
  // perform that one.
  switch (disk)
  {
  case 1:
    output = decrypt_disk1(shifted);
    break;
  case 2:
    output = decrypt_disk2(shifted);
    break;
  case 3:
    output = decrypt_disk3(shifted);
    break;
  case 4:
    output = decrypt_disk4(shifted);
    break;
  case 5:
    output = decrypt_disk5(shifted);
    break;
  }

  // Record this, the most recently decrypted input, as our previous
  // input. We need it to shift later.
  previous_input = input;

  return output;
}

char Rotor::decrypt_disk1(char input)
{
  return (input + 3) % 26 + 65;
}

char Rotor::decrypt_disk2(char input)
{
  return (input + 5) % 26 + 65;
}

char Rotor::decrypt_disk3(char input)
{
  char output = '\0';
  switch (input)
  {
  case 'A':
    output = 'Y';
    break;
  case 'C':
    output = 'T';
    break;
  case 'B':
    output = 'J';
    break;
  case 'E':
    output = 'O';
    break;
  case 'D':
    output = 'Z';
    break;
  case 'G':
    output = 'C';
    break;
  case 'F':
    output = 'G';
    break;
  case 'I':
    output = 'M';
    break;
  case 'H':
    output = 'L';
    break;
  case 'K':
    output = 'E';
    break;
  case 'J':
    output = 'A';
    break;
  case 'M':
    output = 'U';
    break;
  case 'L':
    output = 'K';
    break;
  case 'O':
    output = 'P';
    break;
  case 'N':
    output = 'H';
    break;
  case 'Q':
    output = 'S';
    break;
  case 'P':
    output = 'X';
    break;
  case 'S':
    output = 'W';
    break;
  case 'R':
    output = 'F';
    break;
  case 'U':
    output = 'D';
    break;
  case 'T':
    output = 'B';
    break;
  case 'W':
    output = 'N';
    break;
  case 'V':
    output = 'Q';
    break;
  case 'Y':
    output = 'R';
    break;
  case 'X':
    output = 'V';
    break;
  case 'Z':
    output = 'I';
    break;
  }

  return output;
}

char Rotor::decrypt_disk4(char input)
{
  return input % 2 ? input + 1 : input - 1;
}

char Rotor::decrypt_disk5(char input)
{
  return 'Z' - input + 'A';
}
