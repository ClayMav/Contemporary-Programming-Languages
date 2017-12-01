// -*- mode: cpp -*-

#define BOOST_TEST_DYN_LINK
#define BOOST_TEST_MODULE DecryptorTest
#include <boost/test/unit_test.hpp>
#include "rotor.h"
#include "funcs.h"

/**
 * Test that a Rotor will decrypt letters correctly when using disk 1
 */

const string out = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// This string will be compared with the decrypted text repeatedly
const string finalout = "THE_QUICK_BROWN_FOX_JUMPS_OVER_THE_LAZY_DOG";
// This string will be compared in the decrypt_message checks

BOOST_AUTO_TEST_CASE(test_disk1)
{
  Rotor tester(1);
  string in = "KBLCMDNEOFPGQHRISJTKULVMWN";

  for(unsigned int i = 0; i<in.size();i++)
  {
    in[i] = tester.decrypt(in[i]);
  }
  BOOST_CHECK_EQUAL(in,out);
}

/**
 * Test that a Rotor will decrypt letters correctly when using disk 2
 */
BOOST_AUTO_TEST_CASE(test_disk2)
{
  Rotor tester(2);
  string in = "IBJCKDLEMFNGOHPIQJRKSLTMUN";

  for(unsigned int i = 0; i<in.size();i++)
  {
    in[i] = tester.decrypt(in[i]);
  }
  BOOST_CHECK_EQUAL(in,out); 
}

/**
 * Test that a Rotor will decrypt letters correctly when using disk 3
 */
BOOST_AUTO_TEST_CASE(test_disk3)
{
  Rotor tester(3);
  string in = "JKWYMFANMPWLXZFJMMEYOJJGUJ";

  for(unsigned int i = 0; i<in.size();i++)
  {
    in[i] = tester.decrypt(in[i]);
  }
  BOOST_CHECK_EQUAL(in,out); 
}

/**
 * Test that a Rotor will decrypt letters correctly when using disk 4
 */
BOOST_AUTO_TEST_CASE(test_disk4)
{
  Rotor tester(4);
  string in = "BZEYHXKWNVQUTTWSZRCQFPIOLN";

  for(unsigned int i = 0; i<in.size();i++)
  {
    in[i] = tester.decrypt(in[i]);
  }
  BOOST_CHECK_EQUAL(in,out);
}

/**
 * Test that a Rotor will decrypt letters correctly when using disk 5
 */
BOOST_AUTO_TEST_CASE(test_disk5)
{
  Rotor tester(5);
  string in = "ZZYYXXWWVVUUTTSSRRQQPPOONN";

  for(unsigned int i = 0; i<in.size();i++)
  {
    in[i] = tester.decrypt(in[i]);
  }
  BOOST_CHECK_EQUAL(in,out);
}

BOOST_AUTO_TEST_CASE(test_decrypt_message)
{
  // Tests the final outputs
  BOOST_CHECK_EQUAL(decrypt_message(1,2,3,"UZJ_HVOCY_JFUQR_GBH_BRDJT_ZQCB_HRT_ARPM_EXU"),finalout);
  BOOST_CHECK_EQUAL(decrypt_message(1,2,4,"KWR_YKYLE_NKYQQ_SFT_APFKP_RWHU_XEM_VGND_ELP"),finalout);
  BOOST_CHECK_EQUAL(decrypt_message(1,2,5,"YSD_EWSHA_PMMYA_SPL_CHFCJ_DWTQ_NUO_HYBB_WXR"),finalout);
}
