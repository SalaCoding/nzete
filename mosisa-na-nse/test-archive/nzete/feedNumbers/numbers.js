
const customWords = [
  { value: 0, word: "Libungutulu", group: "0-9" },
  { value: 1, word: "Moko", group: "0-9" },
  { value: 2, word: "Mibale", group: "0-9" },
  { value: 3, word: "Misato", group: "0-9" },
  { value: 4, word: "Minei", group: "0-9" },
  { value: 5, word: "Mitano", group: "0-9" },
  { value: 6, word: "Motoba", group: "0-9" },
  { value: 7, word: "Sambo", group: "0-9" },
  { value: 8, word: "Mwambe", group: "0-9" },
  { value: 9, word: "Libwa", group: "0-9" },

  { value: 10, word: "Zomi", group: "10-19" },
  { value: 11, word: "Zomi na Moko", group: "10-19" },
  { value: 12, word: "Zomi na Mibale", group: "10-19" },
  { value: 13, word: "Zomi na Misato", group: "10-19" },
  { value: 14, word: "Zomi na Minei", group: "10-19" },
  { value: 15, word: "Zomi na Mitano", group: "10-19" },
  { value: 16, word: "Zomi na Motoba", group: "10-19" },
  { value: 17, word: "Zomi na Sambo", group: "10-19" },
  { value: 18, word: "Zomi na Mwambe", group: "10-19" },
  { value: 19, word: "Zomi na Libwa", group: "10-19" },

  { value: 20, word: "Ntuku mibale", group: "20-29" },
  { value: 21, word: "Ntuku mibale na moko", group: "20-29" },
  { value: 22, word: "Ntuku mibale na mibale", group: "20-29" },
  { value: 23, word: "Ntuku mibale na misato", group: "20-29" },
  { value: 24, word: "Ntuku mibale na minei", group: "20-29" },
  { value: 25, word: "Ntuku mibale na mitano", group: "20-29" },
  { value: 26, word: "Ntuku mibale na motoba", group: "20-29" },
  { value: 27, word: "Ntuku mibale na sambo", group: "20-29" },
  { value: 28, word: "Ntuku mibale na mwambe", group: "20-29" },
  { value: 29, word: "Ntuku mibale na libwa", group: "20-29" },

  { value: 30, word: "Ntuku misato", group: "30-39" },
    { value: 31, word: "Ntuku misato na moko", group: "30-39" },
    { value: 32, word: "Ntuku misato na mibale", group: "30-39" },
    { value: 33, word: "Ntuku misato na misato", group: "30-39" },
    { value: 34, word: "Ntuku misato na minei", group: "30-39" },
    { value: 35, word: "Ntuku misato na mitano", group: "30-39" },
    { value: 36, word: "Ntuku misato na motoba", group: "30-39" },
    { value: 37, word: "Ntuku misato na sambo", group: "30-39" },
    { value: 38, word: "Ntuku misato na mwambe", group: "30-39" },
    { value: 39, word: "Ntuku misato na libwa", group: "30-39" },

    { value: 40, word: "Ntuku minei", group: "40-49" },
    { value: 41, word: "Ntuku minei na moko", group: "40-49" },
    { value: 42, word: "Ntuku minei na mibale", group: "40-49" },
    { value: 43, word: "Ntuku minei na misato", group: "40-49" },
    { value: 44, word: "Ntuku minei na minei", group: "40-49" },
    { value: 45, word: "Ntuku minei na mitano", group: "40-49" },
    { value: 46, word: "Ntuku minei na motoba", group: "40-49" },
    { value: 47, word: "Ntuku minei na sambo", group: "40-49" },
    { value: 48, word: "Ntuku minei na mwambe", group: "40-49" },
    { value: 49, word: "Ntuku minei na libwa", group: "40-49" },

    { value: 50, word: "Ntuku mitano", group: "50-59" },
    { value: 51, word: "Ntuku mitano na moko", group: "50-59" },
    { value: 52, word: "Ntuku mitano na mibale", group: "50-59" },
    { value: 53, word: "Ntuku mitano na misato", group: "50-59" },
    { value: 54, word: "Ntuku mitano na minei", group: "50-59" },
    { value: 55, word: "Ntuku mitano na mitano", group: "50-59" },
    { value: 56, word: "Ntuku mitano na motoba", group: "50-59" },
    { value: 57, word: "Ntuku mitano na sambo", group: "50-59" },
    { value: 58, word: "Ntuku mitano na mwambe", group: "50-59" },
    { value: 59, word: "Ntuku mitano na libwa", group: "50-59" },

    { value: 60, word: "Ntuku motoba", group: "60-69" },
    { value: 61, word: "Ntuku motoba na moko", group: "60-69" },
    { value: 62, word: "Ntuku motoba na mibale", group: "60-69" },
    { value: 63, word: "Ntuku motoba na misato", group: "60-69" },
    { value: 64, word: "Ntuku motoba na minei", group: "60-69" },
    { value: 65, word: "Ntuku motoba na mitano", group: "60-69" },
    { value: 66, word: "Ntuku motoba na motoba", group: "60-69" },
    { value: 67, word: "Ntuku motoba na sambo", group: "60-69" },
    { value: 68, word: "Ntuku motoba na mwambe", group: "60-69" },
    { value: 69, word: "Ntuku motoba na libwa", group: "60-69" },

    { value: 70, word: "Nkama sambo", group: "70-79" },
    { value: 71, word: "Nkama sambo na moko", group: "70-79" },
    { value: 72, word: "Nkama sambo na mibale", group: "70-79" },
    { value: 73, word: "Nkama sambo na misato", group: "70-79" },
    { value: 74, word: "Nkama sambo na minei", group: "70-79" },
    { value: 75, word: "Nkama sambo na mitano", group: "70-79" },
    { value: 76, word: "Nkama sambo na motoba", group: "70-79" },
    { value: 77, word: "Nkama sambo na sambo", group: "70-79" },
    { value: 78, word: "Nkama sambo na mwambe", group: "70-79" },
    { value: 79, word: "Nkama sambo na libwa", group: "70-79" },

    { value: 80, word: "Ntuku mwambe", group: "80-89" },
    { value: 81, word: "Ntuku mwambe na moko", group: "80-89" },
    { value: 82, word: "Ntuku mwambe na mibale", group: "80-89" },
    { value: 83, word: "Ntuku mwambe na misato", group: "80-89" },
    { value: 84, word: "Ntuku mwambe na minei", group: "80-89" },
    { value: 85, word: "Ntuku mwambe na mitano", group: "80-89" },
    { value: 86, word: "Ntuku mwambe na motoba", group: "80-89" },
    { value: 87, word: "Ntuku mwambe na sambo", group: "80-89" },
    { value: 88, word: "Ntuku mwambe na mwambe", group: "80-89" },
    { value: 89, word: "Ntuku mwambe na libwa", group: "80-89" },

    { value: 90, word: "Ntuku libwa", group: "90-99" },
    { value: 91, word: "Ntuku libwa na moko", group: "90-99" },
    { value: 92, word: "Ntuku libwa na mibale", group: "90-99" },
    { value: 93, word: "Ntuku libwa na misato", group: "90-99" },
    { value: 94, word: "Ntuku libwa na minei", group: "90-99" },
    { value: 95, word: "Ntuku libwa na mitano", group: "90-99" },
    { value: 96, word: "Ntuku libwa na motoba", group: "90-99" },
    { value: 97, word: "Ntuku libwa na sambo", group: "90-99" },
    { value: 98, word: "Ntuku libwa na mwambe", group: "90-99" },
    { value: 99, word: "Ntuku libwa na libwa", group: "90-99" },

    { value: 100, word: "Nkama", group: "100-109" },
    { value: 101, word: "Nkama na moko", group: "100-109" },
    { value: 102, word: "Nkama na mibale", group: "100-109" },
    { value: 103, word: "Nkama na misato", group: "100-109" },
    { value: 104, word: "Nkama na minei", group: "100-109" },
    { value: 105, word: "Nkama na mitano", group: "100-109" },
    { value: 106, word: "Nkama na motoba", group: "100-109" },
    { value: 107, word: "Nkama na sambo", group: "100-109" },
    { value: 108, word: "Nkama na mwambe", group: "100-109" },
    { value: 109, word: "Nkama na libwa", group: "100-109" },

    { value: 110, word: "Nkama na zomi", group: "110-119" },
    { value: 111, word: "Nkama na zomi na moko", group: "110-119" },
    { value: 112, word: "Nkama na zomi na mibale", group: "110-119" },
    { value: 113, word: "Nkama na zomi na misato", group: "110-119" },
    { value: 114, word: "Nkama na zomi na minei", group: "110-119" },
    { value: 115, word: "Nkama na zomi na mitano", group: "110-119" },
    { value: 116, word: "Nkama na zomi na motoba", group: "110-119" },
    { value: 117, word: "Nkama na zomi na sambo", group: "110-119" },
    { value: 118, word: "Nkama na zomi na mwambe", group: "110-119" },
    { value: 119, word: "Nkama na zomi na libwa", group: "110-119" },

    { value: 120, word: "Nkama na ntuku mibale", group: "120-129" },
    { value: 121, word: "Nkama na ntuku mibale na moko", group: "120-129" },
    { value: 122, word: "Nkama na ntuku mibale na mibale", group: "120-129" },
    { value: 123, word: "Nkama na ntuku mibale na misato", group: "120-129" },
    { value: 124, word: "Nkama na ntuku mibale na minei", group: "120-129" },
    { value: 125, word: "Nkama na ntuku mibale na mitano", group: "120-129" },
    { value: 126, word: "Nkama na ntuku mibale na motoba", group: "120-129" },
    { value: 127, word: "Nkama na ntuku mibale na sambo", group: "120-129" },
    { value: 128, word: "Nkama na ntuku mibale na mwambe", group: "120-129" },
    { value: 129, word: "Nkama na ntuku mibale na libwa", group: "120-129" },

    { value: 130, word: "Nkama na ntuku misato", group: "130-139" },
    { value: 131, word: "Nkama na ntuku misato na moko", group: "130-139" },
    { value: 132, word: "Nkama na ntuku misato na mibale", group: "130-139" },
    { value: 133, word: "Nkama na ntuku misato na misato", group: "130-139" },
    { value: 134, word: "Nkama na ntuku misato na minei", group: "130-139" },
    { value: 135, word: "Nkama na ntuku misato na mitano", group: "130-139" },
    { value: 136, word: "Nkama na ntuku misato na motoba", group: "130-139" },
    { value: 137, word: "Nkama na ntuku misato na sambo", group: "130-139" },
    { value: 138, word: "Nkama na ntuku misato na mwambe", group: "130-139" },
    { value: 139, word: "Nkama na ntuku misato na libwa", group: "130-139" },

    { value: 140, word: "Nkama na ntuku minei", group: "140-149" },
    { value: 141, word: "Nkama na ntuku minei na moko", group: "140-149" },
    { value: 142, word: "Nkama na ntuku minei na mibale", group: "140-149" },
    { value: 143, word: "Nkama na ntuku minei na misato", group: "140-149" },
    { value: 144, word: "Nkama na ntuku minei na minei", group: "140-149" },
    { value: 145, word: "Nkama na ntuku minei na mitano", group: "140-149" },
    { value: 146, word: "Nkama na ntuku minei na motoba", group: "140-149" },
    { value: 147, word: "Nkama na ntuku minei na sambo", group: "140-149" },
    { value: 148, word: "Nkama na ntuku minei na mwambe", group: "140-149" },
    { value: 149, word: "Nkama na ntuku minei na libwa", group: "140-149" },

    { value: 150, word: "Nkama na ntuku mitano", group: "150-159" },
    { value: 151, word: "Nkama na ntuku mitano na moko", group: "150-159" },
    { value: 152, word: "Nkama na ntuku mitano na mibale", group: "150-159" },
    { value: 153, word: "Nkama na ntuku mitano na misato", group: "150-159" },
    { value: 154, word: "Nkama na ntuku mitano na minei", group: "150-159" },
    { value: 155, word: "Nkama na ntuku mitano na mitano", group: "150-159" },
    { value: 156, word: "Nkama na ntuku mitano na motoba", group: "150-159" },
    { value: 157, word: "Nkama na ntuku mitano na sambo", group: "150-159" },
    { value: 158, word: "Nkama na ntuku mitano na mwambe", group: "150-159" },
    { value: 159, word: "Nkama na ntuku mitano na libwa", group: "150-159" },

    { value: 160, word: "Nkama na ntuku motoba", group: "160-169" },
    { value: 161, word: "Nkama na ntuku motoba na moko", group: "160-169" },
    { value: 162, word: "Nkama na ntuku motoba na mibale", group: "160-169" },
    { value: 163, word: "Nkama na ntuku motoba na misato", group: "160-169" },
    { value: 164, word: "Nkama na ntuku motoba na minei", group: "160-169" },
    { value: 165, word: "Nkama na ntuku motoba na mitano", group: "160-169" },
    { value: 166, word: "Nkama na ntuku motoba na motoba", group: "150-159" },
    { value: 167, word: "Nkama na ntuku motoba na sambo", group: "150-159" },
    { value: 168, word: "Nkama na ntuku motoba na mwambe", group: "150-159" },
    { value: 169, word: "Nkama na ntuku motoba na libwa", group: "150-159" },

    { value: 170, word: "Nkama na ntuku sambo", group: "170-179" },
    { value: 171, word: "Nkama na ntuku sambo na moko", group: "170-179" },
    { value: 172, word: "Nkama na ntuku sambo na mibale", group: "170-179" },
    { value: 173, word: "Nkama na ntuku sambo na misato", group: "170-179" },
    { value: 174, word: "Nkama na ntuku sambo na minei", group: "170-179" },
    { value: 175, word: "Nkama na ntuku sambo na mitano", group: "170-179" },
    { value: 176, word: "Nkama na ntuku sambo na motoba", group: "170-179" },
    { value: 177, word: "Nkama na ntuku sambo na sambo", group: "170-179" },
    { value: 178, word: "Nkama na ntuku sambo na mwambe", group: "170-179" },
    { value: 179, word: "Nkama na ntuku sambo na libwa", group: "170-179" },

    { value: 180, word: "Nkama na ntuku mwambe", group: "180-189" },
    { value: 181, word: "Nkama na ntuku mwambe na moko", group: "180-189" },
    { value: 182, word: "Nkama na ntuku mwambe na mibale", group: "180-189" },
    { value: 183, word: "Nkama na ntuku mwambe na misato", group: "180-189" },
    { value: 184, word: "Nkama na ntuku mwambe na minei", group: "180-189" },
    { value: 185, word: "Nkama na ntuku mwambe na mitano", group: "180-189" },
    { value: 186, word: "Nkama na ntuku mwambe na motoba", group: "180-189" },
    { value: 187, word: "Nkama na ntuku mwambe na sambo", group: "180-189" },
    { value: 188, word: "Nkama na ntuku mwambe na mwambe", group: "180-189" },
    { value: 189, word: "Nkama na ntuku mwambe na libwa", group: "180-189" },

    { value: 190, word: "Nkama na ntuku libwa", group: "190-199" },
    { value: 191, word: "Nkama na ntuku libwa na moko", group: "190-199" },
    { value: 192, word: "Nkama na ntuku libwa na mibale", group: "190-199" },
    { value: 193, word: "Nkama na ntuku libwa na misato", group: "190-199" },
    { value: 194, word: "Nkama na ntuku libwa na minei", group: "190-199" },
    { value: 195, word: "Nkama na ntuku libwa na mitano", group: "190-199" },
    { value: 196, word: "Nkama na ntuku libwa na motoba", group: "190-199" },
    { value: 197, word: "Nkama na ntuku libwa na sambo", group: "190-199" },
    { value: 198, word: "Nkama na ntuku libwa na mwambe", group: "190-199" },
    { value: 199, word: "Nkama na ntuku libwa na libwa", group: "190-199" },

    { value: 200, word: "Nkama mibale", group: "200-209" },
    { value: 201, word: "Nkama mibale na moko", group: "200-209" },
    { value: 202, word: "Nkama mibale na mibale", group: "200-209" },
    { value: 203, word: "Nkama mibale na misato", group: "200-209" },
    { value: 204, word: "Nkama mibale na minei", group: "200-209" },
    { value: 205, word: "Nkama mibale na mitano", group: "200-209" },
    { value: 206, word: "Nkama mibale na motoba", group: "200-209" },
    { value: 207, word: "Nkama mibale na sambo", group: "200-209" },
    { value: 208, word: "Nkama mibale na mwambe", group: "200-209" },
    { value: 209, word: "Nkama mibale na libwa", group: "200-209" },

    { value: 210, word: "Nkama mibale na zomi", group: "210-219" },
    { value: 211, word: "Nkama mibale na zomi na moko", group: "210-219" },
    { value: 212, word: "Nkama mibale na zomi na mibale", group: "210-219" },
    { value: 213, word: "Nkama mibale na zomi na misato", group: "210-219" },
    { value: 214, word: "Nkama mibale na zomi na minei", group: "210-219" },
    { value: 215, word: "Nkama mibale na zomi na mitano", group: "210-219" },
    { value: 216, word: "Nkama mibale na zomi na motoba", group: "210-219" },
    { value: 217, word: "Nkama mibale na zomi na sambo", group: "210-219" },
    { value: 218, word: "Nkama mibale na zomi na mwambe", group: "210-219" },
    { value: 219, word: "Nkama mibale na zomi na libwa", group: "210-219" },

    { value: 220, word: "Nkama mibale na ntuku mibale", group: "220-229" },
    { value: 221, word: "Nkama mibale na ntuku mibale na moko", group: "220-229" },
    { value: 222, word: "Nkama mibale na ntuku mibale na mibale", group: "220-229" },
    { value: 223, word: "Nkama mibale na ntuku mibale na misato", group: "220-229" },
    { value: 224, word: "Nkama mibale na ntuku mibale na minei", group: "220-229" },
    { value: 225, word: "Nkama mibale na ntuku mibale na mitano", group: "220-229" },
    { value: 226, word: "Nkama mibale na ntuku mibale na motoba", group: "220-229" },
    { value: 227, word: "Nkama mibale na ntuku mibale na sambo", group: "220-229" },
    { value: 228, word: "Nkama mibale na ntuku mibale na mwambe", group: "220-229" },
    { value: 229, word: "Nkama mibale na ntuku mibale na libwa", group: "220-229" },

    { value: 230, word: "Nkama mibale na ntuku misato", group: "230-239" },
    { value: 231, word: "Nkama mibale na ntuku misato na moko", group: "230-239" },
    { value: 232, word: "Nkama mibale na ntuku misato na mibale", group: "230-239" },
    { value: 233, word: "Nkama mibale na ntuku misato na misato", group: "230-239" },
    { value: 234, word: "Nkama mibale na ntuku misato na minei", group: "230-239" },
    { value: 235, word: "Nkama mibale na ntuku misato na mitano", group: "230-239" },
    { value: 236, word: "Nkama mibale na ntuku misato na motoba", group: "230-239" },
    { value: 237, word: "Nkama mibale na ntuku misato na sambo", group: "230-239" },
    { value: 238, word: "Nkama mibale na ntuku misato na mwambe", group: "230-239" },
    { value: 239, word: "Nkama mibale na ntuku misato na libwa", group: "230-239" },

    { value: 240, word: "Nkama mibale na ntuku minei", group: "240-249" },
    { value: 241, word: "Nkama mibale na ntuku minei na moko", group: "240-249" },
    { value: 242, word: "Nkama mibale na ntuku minei na mibale", group: "240-249" },
    { value: 243, word: "Nkama mibale na ntuku minei na misato", group: "240-249" },
    { value: 244, word: "Nkama mibale na ntuku minei na minei", group: "240-249" },
    { value: 245, word: "Nkama mibale na ntuku minei na mitano", group: "240-249" },
    { value: 246, word: "Nkama mibale na ntuku minei na motoba", group: "240-249" },
    { value: 247, word: "Nkama mibale na ntuku minei na sambo", group: "240-249" },
    { value: 248, word: "Nkama mibale na ntuku minei na mwambe", group: "240-249" },
    { value: 249, word: "Nkama mibale na ntuku minei na libwa", group: "240-249" },

    { value: 250, word: "Nkama mibale na ntuku mitano", group: "250-259" },
    { value: 251, word: "Nkama mibale na ntuku mitano na moko", group: "250-259" },
    { value: 252, word: "Nkama mibale na ntuku mitano na mibale", group: "250-259" },
    { value: 253, word: "Nkama mibale na ntuku mitano na misato", group: "250-259" },
    { value: 254, word: "Nkama mibale na ntuku mitano na minei", group: "250-259" },
    { value: 255, word: "Nkama mibale na ntuku mitano na mitano", group: "250-259" },
    { value: 256, word: "Nkama mibale na ntuku mitano na motoba", group: "250-259" },
    { value: 257, word: "Nkama mibale na ntuku mitano na sambo", group: "250-259" },
    { value: 258, word: "Nkama mibale na ntuku mitano na mwambe", group: "250-259" },
    { value: 259, word: "Nkama mibale na ntuku mitano na libwa", group: "250-259" },

    { value: 260, word: "Nkama mibale na ntuku motoba", group: "260-269" },
    { value: 261, word: "Nkama mibale na ntuku motoba na moko", group: "260-269" },
    { value: 262, word: "Nkama mibale na ntuku motoba na mibale", group: "260-269" },
    { value: 263, word: "Nkama mibale na ntuku motoba na misato", group: "260-269" },
    { value: 264, word: "Nkama mibale na ntuku motoba na minei", group: "260-269" },
    { value: 265, word: "Nkama mibale na ntuku motoba na mitano", group: "260-269" },
    { value: 266, word: "Nkama mibale na ntuku motoba na motoba", group: "260-269" },
    { value: 267, word: "Nkama mibale na ntuku motoba na sambo", group: "260-269" },
    { value: 268, word: "Nkama mibale na ntuku motoba na mwambe", group: "260-269" },
    { value: 269, word: "Nkama mibale na ntuku motoba na libwa", group: "260-269" },

    { value: 270, word: "Nkama mibale na ntuku sambo", group: "270-279" },
    { value: 271, word: "Nkama mibale na ntuku sambo na moko", group: "270-279" },
    { value: 272, word: "Nkama mibale na ntuku sambo na mibale", group: "270-279" },
    { value: 273, word: "Nkama mibale na ntuku sambo na misato", group: "270-279" },
    { value: 274, word: "Nkama mibale na ntuku sambo na minei", group: "270-279" },
    { value: 275, word: "Nkama mibale na ntuku sambo na mitano", group: "270-279" },
    { value: 276, word: "Nkama mibale na ntuku sambo na motoba", group: "270-279" },
    { value: 277, word: "Nkama mibale na ntuku sambo na sambo", group: "270-279" },
    { value: 278, word: "Nkama mibale na ntuku sambo na mwambe", group: "270-279" },
    { value: 279, word: "Nkama mibale na ntuku sambo na libwa", group: "270-279" },

    { value: 280, word: "Nkama mibale na ntuku mwambe", group: "280-289" },
    { value: 281, word: "Nkama mibale na ntuku mwambe na moko", group: "280-289" },
    { value: 282, word: "Nkama mibale na ntuku mwambe na mibale", group: "280-289" },
    { value: 283, word: "Nkama mibale na ntuku mwambe na misato", group: "280-289" },
    { value: 284, word: "Nkama mibale na ntuku mwambe na minei", group: "280-289" },
    { value: 285, word: "Nkama mibale na ntuku mwambe na mitano", group: "280-289" },
    { value: 286, word: "Nkama mibale na ntuku mwambe na motoba", group: "280-289" },
    { value: 287, word: "Nkama mibale na ntuku mwambe na sambo", group: "280-289" },
    { value: 288, word: "Nkama mibale na ntuku mwambe na mwambe", group: "280-289" },
    { value: 289, word: "Nkama mibale na ntuku mwambe na libwa", group: "280-289" },

    { value: 290, word: "Nkama mibale na ntuku libwa", group: "290-299" },
    { value: 291, word: "Nkama mibale na ntuku libwa na moko", group: "290-299" },
    { value: 292, word: "Nkama mibale na ntuku libwa na mibale", group: "290-299" },
    { value: 293, word: "Nkama mibale na ntuku libwa na misato", group: "290-299" },
    { value: 294, word: "Nkama mibale na ntuku libwa na minei", group: "290-299" },
    { value: 295, word: "Nkama mibale na ntuku libwa na mitano", group: "290-299" },
    { value: 296, word: "Nkama mibale na ntuku libwa na motoba", group: "290-299" },
    { value: 297, word: "Nkama mibale na ntuku libwa na sambo", group: "290-299" },
    { value: 298, word: "Nkama mibale na ntuku libwa na mwambe", group: "290-299" },
    { value: 299, word: "Nkama mibale na ntuku libwa na libwa", group: "290-299" },

    { value: 300, word: "Nkama misato", group: "300-309" },
    { value: 301, word: "Nkama misato na moko", group: "300-309" },
    { value: 302, word: "Nkama misato na mibale", group: "300-309" },
    { value: 303, word: "Nkama misato na misato", group: "300-309" },
    { value: 304, word: "Nkama misato na minei", group: "300-309" },
    { value: 305, word: "Nkama misato na mitano", group: "300-309" },
    { value: 306, word: "Nkama misato na motoba", group: "300-309" },
    { value: 307, word: "Nkama misato na sambo", group: "300-309" },
    { value: 308, word: "Nkama misato na mwambe", group: "300-309" },
    { value: 309, word: "Nkama misato na libwa", group: "300-309" },

    { value: 310, word: "Nkama misato na zomi", group: "310-319" },
    { value: 311, word: "Nkama misato na zomi na moko", group: "310-319" },
    { value: 312, word: "Nkama misato na zomi na mibale", group: "310-319" },
    { value: 313, word: "Nkama misato na zomi na misato", group: "310-319" },
    { value: 314, word: "Nkama misato na zomi na minei", group: "310-319" },
    { value: 315, word: "Nkama misato na zomi na mitano", group: "310-319" },
    { value: 316, word: "Nkama misato na zomi na motoba", group: "310-319" },
    { value: 317, word: "Nkama misato na zomi na sambo", group: "310-319" },
    { value: 318, word: "Nkama misato na zomi na mwambe", group: "310-319" },
    { value: 319, word: "Nkama misato na zomi na libwa", group: "310-319" },

    { value: 320, word: "Nkama misato na ntuku mibale", group: "320-329" },
    { value: 321, word: "Nkama misato na ntuku mibale na moko", group: "320-329" },
    { value: 322, word: "Nkama misato na ntuku mibale na mibale", group: "320-329" },
    { value: 323, word: "Nkama misato na ntuku mibale na misato", group: "320-329" },
    { value: 324, word: "Nkama misato na ntuku mibale na minei", group: "320-329" },
    { value: 325, word: "Nkama misato na ntuku mibale na mitano", group: "320-329" },
    { value: 326, word: "Nkama misato na ntuku mibale na motoba", group: "320-329" },
    { value: 327, word: "Nkama misato na ntuku mibale na sambo", group: "320-329" },
    { value: 328, word: "Nkama misato na ntuku mibale na mwambe", group: "320-329" },
    { value: 329, word: "Nkama misato na ntuku mibale na libwa", group: "320-329" },

    { value: 330, word: "Nkama misato na ntuku misato", group: "330-339" },
    { value: 331, word: "Nkama misato na ntuku misato na moko", group: "330-339" },
    { value: 332, word: "Nkama misato na ntuku misato na mibale", group: "330-339" },
    { value: 333, word: "Nkama misato na ntuku misato na misato", group: "330-339" },
    { value: 334, word: "Nkama misato na ntuku misato na minei", group: "330-339" },
    { value: 335, word: "Nkama misato na ntuku misato na mitano", group: "330-339" },
    { value: 336, word: "Nkama misato na ntuku misato na motoba", group: "330-339" },
    { value: 337, word: "Nkama misato na ntuku misato na sambo", group: "330-339" },
    { value: 338, word: "Nkama misato na ntuku misato na mwambe", group: "330-339" },
    { value: 339, word: "Nkama misato na ntuku misato na libwa", group: "330-339" },

    { value: 340, word: "Nkama misato na ntuku minei", group: "340-349" },
    { value: 341, word: "Nkama misato na ntuku minei na moko", group: "340-349" },
    { value: 342, word: "Nkama misato na ntuku minei na mibale", group: "340-349" },
    { value: 343, word: "Nkama misato na ntuku minei na misato", group: "340-349" },
    { value: 344, word: "Nkama misato na ntuku minei na minei", group: "340-349" },
    { value: 345, word: "Nkama misato na ntuku minei na mitano", group: "340-349" },
    { value: 346, word: "Nkama misato na ntuku minei na motoba", group: "340-349" },
    { value: 347, word: "Nkama misato na ntuku minei na sambo", group: "340-349" },
    { value: 348, word: "Nkama misato na ntuku minei na mwambe", group: "340-349" },
    { value: 349, word: "Nkama misato na ntuku minei na libwa", group: "340-349" },

    { value: 350, word: "Nkama misato na ntuku mitano", group: "350-359" },
    { value: 351, word: "Nkama misato na ntuku mitano na moko", group: "350-359" },
    { value: 352, word: "Nkama misato na ntuku mitano na mibale", group: "350-359" },
    { value: 353, word: "Nkama misato na ntuku mitano na misato", group: "350-359" },
    { value: 354, word: "Nkama misato na ntuku mitano na minei", group: "350-359" },
    { value: 355, word: "Nkama misato na ntuku mitano na mitano", group: "350-359" },
    { value: 356, word: "Nkama misato na ntuku mitano na motoba", group: "350-359" },
    { value: 357, word: "Nkama misato na ntuku mitano na sambo", group: "350-359" },
    { value: 358, word: "Nkama misato na ntuku mitano na mwambe", group: "350-359" },
    { value: 359, word: "Nkama misato na ntuku mitano na libwa", group: "350-359" },

    { value: 360, word: "Nkama misato na ntuku motoba", group: "360-369" },
    { value: 361, word: "Nkama misato na ntuku motoba na moko", group: "360-369" },
    { value: 362, word: "Nkama misato na ntuku motoba na mibale", group: "360-369" },
    { value: 363, word: "Nkama misato na ntuku motoba na misato", group: "360-369" },
    { value: 364, word: "Nkama misato na ntuku motoba na minei", group: "360-369" },
    { value: 365, word: "Nkama misato na ntuku motoba na mitano", group: "360-369" },
    { value: 366, word: "Nkama misato na ntuku motoba na motoba", group: "360-369" },
    { value: 367, word: "Nkama misato na ntuku motoba na sambo", group: "360-369" },
    { value: 368, word: "Nkama misato na ntuku motoba na mwambe", group: "360-369" },
    { value: 369, word: "Nkama misato na ntuku motoba na libwa", group: "360-369" },

    { value: 370, word: "Nkama misato na ntuku sambo", group: "370-379" },
    { value: 371, word: "Nkama misato na ntuku sambo na moko", group: "370-379" },
    { value: 372, word: "Nkama misato na ntuku sambo na mibale", group: "370-379" },
    { value: 373, word: "Nkama misato na ntuku sambo na misato", group: "370-379" },
    { value: 374, word: "Nkama misato na ntuku sambo na minei", group: "370-379" },
    { value: 375, word: "Nkama misato na ntuku sambo na mitano", group: "370-379" },
    { value: 376, word: "Nkama misato na ntuku sambo na motoba", group: "370-379" },
    { value: 377, word: "Nkama misato na ntuku sambo na sambo", group: "370-379" },
    { value: 378, word: "Nkama misato na ntuku sambo na mwambe", group: "370-379" },
    { value: 379, word: "Nkama misato na ntuku sambo na libwa", group: "370-379" },

    { value: 380, word: "Nkama misato na ntuku mwambe", group: "380-389" },
    { value: 381, word: "Nkama misato na ntuku mwambe na moko", group: "380-389" },
    { value: 382, word: "Nkama misato na ntuku mwambe na mibale", group: "380-389" },
    { value: 383, word: "Nkama misato na ntuku mwambe na misato", group: "380-389" },
    { value: 384, word: "Nkama misato na ntuku mwambe na minei", group: "380-389" },
    { value: 385, word: "Nkama misato na ntuku mwambe na mitano", group: "380-389" },
    { value: 386, word: "Nkama misato na ntuku mwambe na motoba", group: "380-389" },
    { value: 387, word: "Nkama misato na ntuku mwambe na sambo", group: "380-389" },
    { value: 388, word: "Nkama misato na ntuku mwambe na mwambe", group: "380-389" },
    { value: 389, word: "Nkama misato na ntuku mwambe na libwa", group: "380-389" },

    { value: 390, word: "Nkama misato na ntuku libwa", group: "390-399" },
    { value: 391, word: "Nkama misato na ntuku libwa na moko", group: "390-399" },
    { value: 392, word: "Nkama misato na ntuku libwa na mibale", group: "390-399" },
    { value: 393, word: "Nkama misato na ntuku libwa na misato", group: "390-399" },
    { value: 394, word: "Nkama misato na ntuku libwa na minei", group: "390-399" },
    { value: 395, word: "Nkama misato na ntuku libwa na mitano", group: "390-399" },
    { value: 396, word: "Nkama misato na ntuku libwa na motoba", group: "390-399" },
    { value: 397, word: "Nkama misato na ntuku libwa na sambo", group: "390-399" },
    { value: 398, word: "Nkama misato na ntuku libwa na mwambe", group: "390-399" },
    { value: 399, word: "Nkama misato na ntuku libwa na libwa", group: "390-399" },

    { value: 400, word: "Nkama minei", group: "400-409" },
    { value: 401, word: "Nkama minei na moko", group: "400-409" },
    { value: 402, word: "Nkama minei na mibale", group: "400-409" },
    { value: 403, word: "Nkama minei na misato", group: "400-409" },
    { value: 404, word: "Nkama minei na minei", group: "400-409" },
    { value: 405, word: "Nkama minei na mitano", group: "400-409" },
    { value: 406, word: "Nkama minei na motoba", group: "400-409" },
    { value: 407, word: "Nkama minei na sambo", group: "400-409" },
    { value: 408, word: "Nkama minei na mwambe", group: "400-409" },
    { value: 409, word: "Nkama minei na libwa", group: "400-409" },

    { value: 410, word: "Nkama minei na zomi", group: "410-419" },
    { value: 411, word: "Nkama minei na zomi na moko", group: "410-419" },
    { value: 412, word: "Nkama minei na zomi na mibale", group: "410-419" },
    { value: 413, word: "Nkama minei na zomi na misato", group: "410-419" },
    { value: 414, word: "Nkama minei na zomi na minei", group: "410-419" },
    { value: 415, word: "Nkama minei na zomi na mitano", group: "410-419" },
    { value: 416, word: "Nkama minei na zomi na motoba", group: "410-419" },
    { value: 417, word: "Nkama minei na zomi na sambo", group: "410-419" },
    { value: 418, word: "Nkama minei na zomi na mwambe", group: "410-419" },
    { value: 419, word: "Nkama minei na zomi na libwa", group: "410-419" },

    { value: 420, word: "Nkama minei na ntuku mibale", group: "420-429" },
    { value: 421, word: "Nkama minei na ntuku mibale na moko", group: "420-429" },
    { value: 422, word: "Nkama minei na ntuku mibale na mibale", group: "420-429" },
    { value: 423, word: "Nkama minei na ntuku mibale na misato", group: "420-429" },
    { value: 424, word: "Nkama minei na ntuku mibale na minei", group: "420-429" },
    { value: 425, word: "Nkama minei na ntuku mibale na mitano", group: "420-429" },
    { value: 426, word: "Nkama minei na ntuku mibale na motoba", group: "420-429" },
    { value: 427, word: "Nkama minei na ntuku mibale na sambo", group: "420-429" },
    { value: 428, word: "Nkama minei na ntuku mibale na mwambe", group: "420-429" },
    { value: 429, word: "Nkama minei na ntuku mibale na libwa", group: "420-429" },

    { value: 430, word: "Nkama minei na ntuku misato", group: "430-439" },
    { value: 431, word: "Nkama minei na ntuku misato na moko", group: "430-439" },
    { value: 432, word: "Nkama minei na ntuku misato na mibale", group: "430-439" },
    { value: 433, word: "Nkama minei na ntuku misato na misato", group: "430-439" },
    { value: 434, word: "Nkama minei na ntuku misato na minei", group: "430-439" },
    { value: 435, word: "Nkama minei na ntuku misato na mitano", group: "430-439" },
    { value: 436, word: "Nkama minei na ntuku misato na motoba", group: "430-439" },
    { value: 437, word: "Nkama minei na ntuku misato na sambo", group: "430-439" },
    { value: 438, word: "Nkama minei na ntuku misato na mwambe", group: "430-439" },
    { value: 439, word: "Nkama minei na ntuku misato na libwa", group: "430-439" },

    { value: 440, word: "Nkama minei na ntuku minei", group: "440-449" },
    { value: 441, word: "Nkama minei na ntuku minei na moko", group: "440-449" },
    { value: 442, word: "Nkama minei na ntuku minei na mibale", group: "440-449" },
    { value: 443, word: "Nkama minei na ntuku minei na misato", group: "440-449" },
    { value: 444, word: "Nkama minei na ntuku minei na minei", group: "440-449" },
    { value: 445, word: "Nkama minei na ntuku minei na mitano", group: "440-449" },
    { value: 446, word: "Nkama minei na ntuku minei na motoba", group: "440-449" },
    { value: 447, word: "Nkama minei na ntuku minei na sambo", group: "440-449" },
    { value: 448, word: "Nkama minei na ntuku minei na mwambe", group: "440-449" },
    { value: 449, word: "Nkama minei na ntuku minei na libwa", group: "440-449" },

    { value: 450, word: "Nkama minei na ntuku mitano", group: "450-459" },
    { value: 451, word: "Nkama minei na ntuku mitano na moko", group: "450-459" },
    { value: 452, word: "Nkama minei na ntuku mitano na mibale", group: "450-459" },
    { value: 453, word: "Nkama minei na ntuku mitano na misato", group: "450-459" },
    { value: 454, word: "Nkama minei na ntuku mitano na minei", group: "450-459" },
    { value: 455, word: "Nkama minei na ntuku mitano na mitano", group: "450-459" },
    { value: 456, word: "Nkama minei na ntuku mitano na motoba", group: "450-459" },
    { value: 457, word: "Nkama minei na ntuku mitano na sambo", group: "450-459" },
    { value: 458, word: "Nkama minei na ntuku mitano na mwambe", group: "450-459" },
    { value: 459, word: "Nkama minei na ntuku mitano na libwa", group: "450-459" },

    { value: 460, word: "Nkama minei na ntuku motoba", group: "460-469" },

    { value: 470, word: "Nkama minei na ntuku sambo", group: "470-479" },

    { value: 480, word: "Nkama minei na ntuku mwambe", group: "480-489" },

    { value: 490, word: "Nkama minei na ntuku libwa", group: "490-499" },

    // Extend further as needed
    { value: 500, word: "Nkama mitano", group: "500-509" },
    { value: 501, word: "Nkama mitano na moko", group: "500-509" },
    { value: 502, word: "Nkama mitano na mibale", group: "500-509" },
    { value: 503, word: "Nkama mitano na misato", group: "500-509" },
    { value: 504, word: "Nkama mitano na minei", group: "500-509" },
    { value: 505, word: "Nkama mitano na mitano", group: "500-509" },
    { value: 506, word: "Nkama mitano na motoba", group: "500-509" },
    { value: 507, word: "Nkama mitano na sambo", group: "500-509" },
    { value: 508, word: "Nkama mitano na mwambe", group: "500-509" },
    { value: 509, word: "Nkama mitano na libwa", group: "500-509" },

    { value: 510, word: "Nkama mitano na zomi", group: "510-519" },
    { value: 511, word: "Nkama mitano na zomi na moko", group: "510-519" },
    { value: 512, word: "Nkama mitano na zomi na mibale", group: "510-519" },
    { value: 513, word: "Nkama mitano na zomi na misato", group: "510-519" },
    { value: 514, word: "Nkama mitano na zomi na minei", group: "510-519" },
    { value: 515, word: "Nkama mitano na zomi na mitano", group: "510-519" },
    { value: 516, word: "Nkama mitano na zomi na motoba", group: "510-519" },
    { value: 517, word: "Nkama mitano na zomi na sambo", group: "510-519" },
    { value: 518, word: "Nkama mitano na zomi na mwambe", group: "510-519" },
    { value: 519, word: "Nkama mitano na zomi na libwa", group: "510-519" },

    { value: 520, word: "Nkama mitano na ntuku mibale", group: "520-529" },
    { value: 521, word: "Nkama mitano na ntuku mibale na moko", group: "520-529" },
    { value: 522, word: "Nkama mitano na ntuku mibale na mibale", group: "520-529" },
    { value: 523, word: "Nkama mitano na ntuku mibale na misato", group: "520-529" },
    { value: 524, word: "Nkama mitano na ntuku mibale na minei", group: "520-529" },
    { value: 525, word: "Nkama mitano na ntuku mibale na mitano", group: "520-529" },
    { value: 526, word: "Nkama mitano na ntuku mibale na motoba", group: "520-529" },
    { value: 527, word: "Nkama mitano na ntuku mibale na sambo", group: "520-529" },
    { value: 528, word: "Nkama mitano na ntuku mibale na mwambe", group: "520-529" },
    { value: 529, word: "Nkama mitano na ntuku mibale na libwa", group: "520-529" },

    { value: 530, word: "Nkama mitano na ntuku misato", group: "530-539" },
    { value: 531, word: "Nkama mitano na ntuku misato na moko", group: "530-539" },
    { value: 532, word: "Nkama mitano na ntuku misato na mibale", group: "530-539" },
    { value: 533, word: "Nkama mitano na ntuku misato na misato", group: "530-539" },
    { value: 534, word: "Nkama mitano na ntuku misato na minei", group: "530-539" },
    { value: 535, word: "Nkama mitano na ntuku misato na mitano", group: "530-539" },
    { value: 536, word: "Nkama mitano na ntuku misato na motoba", group: "530-539" },
    { value: 537, word: "Nkama mitano na ntuku misato na sambo", group: "530-539" },
    { value: 538, word: "Nkama mitano na ntuku misato na mwambe", group: "530-539" },
    { value: 539, word: "Nkama mitano na ntuku misato na libwa", group: "530-539" },

    { value: 540, word: "Nkama mitano na ntuku minei", group: "540-549" },
    { value: 541, word: "Nkama mitano na ntuku minei na moko", group: "540-549" },
    { value: 542, word: "Nkama mitano na ntuku minei na mibale", group: "540-549" },
    { value: 543, word: "Nkama mitano na ntuku minei na misato", group: "540-549" },
    { value: 544, word: "Nkama mitano na ntuku minei na minei", group: "540-549" },
    { value: 545, word: "Nkama mitano na ntuku minei na mitano", group: "540-549" },
    { value: 546, word: "Nkama mitano na ntuku minei na motoba", group: "540-549" },
    { value: 547, word: "Nkama mitano na ntuku minei na sambo", group: "540-549" },
    { value: 548, word: "Nkama mitano na ntuku minei na mwambe", group: "540-549" },
    { value: 549, word: "Nkama mitano na ntuku minei na libwa", group: "540-549" },
    
    { value: 550, word: "Nkama mitano na ntuku mitano", group: "550-559" },
    { value: 551, word: "Nkama mitano na ntuku mitano na moko", group: "550-559" },
    { value: 552, word: "Nkama mitano na ntuku mitano na mibale", group: "550-559" },
    { value: 553, word: "Nkama mitano na ntuku mitano na misato", group: "550-559" },
    { value: 554, word: "Nkama mitano na ntuku mitano na minei", group: "550-559" },
    { value: 555, word: "Nkama mitano na ntuku mitano na mitano", group: "550-559" },
    { value: 556, word: "Nkama mitano na ntuku mitano na motoba", group: "550-559" },
    { value: 557, word: "Nkama mitano na ntuku mitano na sambo", group: "550-559" },
    { value: 558, word: "Nkama mitano na ntuku mitano na mwambe", group: "550-559" },
    { value: 559, word: "Nkama mitano na ntuku mitano na libwa", group: "550-559" },

    { value: 560, word: "Nkama mitano na ntuku motoba", group: "560-569" },

    { value: 570, word: "Nkama mitano na ntuku sambo", group: "570-579" },

    { value: 580, word: "Nkama mitano na ntuku mwambe", group: "580-589" },

    { value: 590, word: "Nkama mitano na ntuku libwa", group: "590-599" },
    
    // Extend further as needed
    { value: 600, word: "Nkama motoba", group: "600-609" },
    { value: 601, word: "Nkama motoba na moko", group: "600-609" },
    { value: 602, word: "Nkama motoba na mibale", group: "600-609" },
    { value: 603, word: "Nkama motoba na misato", group: "600-609" },
    { value: 604, word: "Nkama motoba na minei", group: "600-609" },
    { value: 605, word: "Nkama motoba na mitano", group: "600-609" },
    { value: 606, word: "Nkama motoba na motoba", group: "600-609" },
    { value: 607, word: "Nkama motoba na sambo", group: "600-609" },
    { value: 608, word: "Nkama motoba na mwambe", group: "600-609" },
    { value: 609, word: "Nkama motoba na libwa", group: "600-609" },
    // Extend further as needed
    { value: 610, word: "Nkama motoba na zomi", group: "610-619" },
    { value: 611, word: "Nkama motoba na zomi na moko", group: "610-619" },
    { value: 612, word: "Nkama motoba na zomi na mibale", group: "610-619" },
    { value: 613, word: "Nkama motoba na zomi na misato", group: "610-619" },
    { value: 614, word: "Nkama motoba na zomi na minei", group: "610-619" },
    { value: 615, word: "Nkama motoba na zomi na mitano", group: "610-619" },
    { value: 616, word: "Nkama motoba na zomi na motoba", group: "610-619" },
    { value: 617, word: "Nkama motoba na zomi na sambo", group: "610-619" },
    { value: 618, word: "Nkama motoba na zomi na mwambe", group: "610-619" },
    { value: 619, word: "Nkama motoba na zomi na libwa", group: "610-619" },
    // Extend further as needed
    { value: 620, word: "Nkama motoba na ntuku mibale", group: "620-629" },
    { value: 621, word: "Nkama motoba na ntuku mibale na moko", group: "620-629" },
    { value: 622, word: "Nkama motoba na ntuku mibale na mibale", group: "620-629" },
    { value: 623, word: "Nkama motoba na ntuku mibale na misato", group: "620-629" },
    { value: 624, word: "Nkama motoba na ntuku mibale na minei", group: "620-629" },
    { value: 625, word: "Nkama motoba na ntuku mibale na mitano", group: "620-629" },
    { value: 626, word: "Nkama motoba na ntuku mibale na motoba", group: "620-629" },
    { value: 627, word: "Nkama motoba na ntuku mibale na sambo", group: "620-629" },
    { value: 628, word: "Nkama motoba na ntuku mibale na mwambe", group: "620-629" },
    { value: 629, word: "Nkama motoba na ntuku mibale na libwa", group: "620-629" },

    { value: 630, word: "Nkama motoba na ntuku misato", group: "630-639" },

    { value: 640, word: "Nkama motoba na ntuku minei", group: "640-649" },

    { value: 650, word: "Nkama motoba na ntuku mitano", group: "650-659" },

    { value: 660, word: "Nkama motoba na ntuku motoba", group: "660-669" },

    { value: 670, word: "Nkama motoba na ntuku sambo", group: "670-679" },

    { value: 680, word: "Nkama motoba na ntuku mwambe", group: "680-689" },

    { value: 690, word: "Nkama motoba na ntuku libwa", group: "690-699" },

    // Extend further as needed
    { value: 700, word: "Nkama sambo", group: "700-709" },
    { value: 701, word: "Nkama sambo na moko", group: "700-709" },
    { value: 702, word: "Nkama sambo na mibale", group: "700-709" },
    { value: 703, word: "Nkama sambo na misato", group: "700-709" },
    { value: 704, word: "Nkama sambo na minei", group: "700-709" },
    { value: 705, word: "Nkama sambo na mitano", group: "700-709" },
    { value: 706, word: "Nkama sambo na motoba", group: "700-709" },
    { value: 707, word: "Nkama sambo na sambo", group: "700-709" },
    { value: 708, word: "Nkama sambo na mwambe", group: "700-709" },
    { value: 709, word: "Nkama sambo na libwa", group: "700-709" },

    { value: 710, word: "Nkama sambo na zomi", group: "710-719" },

    { value: 720, word: "Nkama sambo na ntuku mibale", group: "720-729" },

    { value: 730, word: "Nkama sambo na ntuku misato", group: "730-739" },

    { value: 740, word: "Nkama sambo na ntuku minei", group: "740-749" },

    { value: 750, word: "Nkama sambo na ntuku mitano", group: "750-759" },

    { value: 760, word: "Nkama sambo na ntuku motoba", group: "760-769" },

    { value: 770, word: "Nkama sambo na ntuku sambo", group: "770-779" },

    { value: 780, word: "Nkama sambo na ntuku mwambe", group: "780-789" },

    { value: 790, word: "Nkama sambo na ntuku libwa", group: "790-799" },

    // Extend further as needed
    { value: 800, word: "Nkama mwambe", group: "800-809" },
    { value: 801, word: "Nkama mwambe na moko", group: "800-809" },
    { value: 802, word: "Nkama mwambe na mibale", group: "800-809" },
    { value: 803, word: "Nkama mwambe na misato", group: "800-809" },
    { value: 804, word: "Nkama mwambe na minei", group: "800-809" },
    { value: 805, word: "Nkama mwambe na mitano", group: "800-809" },
    { value: 806, word: "Nkama mwambe na motoba", group: "800-809" },
    { value: 807, word: "Nkama mwambe na sambo", group: "800-809" },
    { value: 808, word: "Nkama mwambe na mwambe", group: "800-809" },
    { value: 809, word: "Nkama mwambe na libwa", group: "800-809" },

    { value: 810, word: "Nkama mwambe na zomi", group: "810-819" },

    { value: 820, word: "Nkama mwambe na ntuku mibale", group: "820-829" },

    { value: 830, word: "Nkama mwambe na ntuku misato", group: "830-839" },

    { value: 840, word: "Nkama mwambe na ntuku minei", group: "840-849" },

    { value: 850, word: "Nkama mwambe na ntuku mitano", group: "850-859" },

    { value: 860, word: "Nkama mwambe na ntuku motoba", group: "860-869" },

    { value: 870, word: "Nkama mwambe na ntuku sambo", group: "870-879" },

    { value: 880, word: "Nkama mwambe na ntuku mwambe", group: "880-889" },

    { value: 890, word: "Nkama mwambe na ntuku libwa", group: "890-899" },
    // Extend further as needed
    { value: 900, word: "Nkama libwa", group: "900-909" },
    { value: 901, word: "Nkama libwa na moko", group: "900-909" },
    { value: 902, word: "Nkama libwa na mibale", group: "900-909" },
    { value: 903, word: "Nkama libwa na misato", group: "900-909" },
    { value: 904, word: "Nkama libwa na minei", group: "900-909" },
    { value: 905, word: "Nkama libwa na mitano", group: "900-909" },
    { value: 906, word: "Nkama libwa na motoba", group: "900-909" },
    { value: 907, word: "Nkama libwa na sambo", group: "900-909" },
    { value: 908, word: "Nkama libwa na mwambe", group: "900-909" },
    { value: 909, word: "Nkama libwa na libwa", group: "900-909" },

    { value: 910, word: "Nkama libwa na zomi", group: "910-919" },
    { value: 911, word: "Nkama libwa na zomi na moko", group: "910-919" },
    { value: 912, word: "Nkama libwa na zomi na mibale", group: "910-919" },
    { value: 913, word: "Nkama libwa na zomi na misato", group: "910-919" },
    { value: 914, word: "Nkama libwa na zomi na minei", group: "910-919" },
    { value: 915, word: "Nkama libwa na zomi na mitano", group: "910-919" },
    { value: 916, word: "Nkama libwa na zomi na motoba", group: "910-919" },
    { value: 917, word: "Nkama libwa na zomi na sambo", group: "910-919" },
    { value: 918, word: "Nkama libwa na zomi na mwambe", group: "910-919" },
    { value: 919, word: "Nkama libwa na zomi na libwa", group: "910-919" },

    { value: 920, word: "Nkama libwa na ntuku mibale", group: "910-919" },
    { value: 921, word: "Nkama libwa na ntuku mibale na moko", group: "920-929" },
    { value: 922, word: "Nkama libwa na ntuku mibale na mibale", group: "920-929" },
    { value: 923, word: "Nkama libwa na ntuku mibale na misato", group: "920-929" },
    { value: 924, word: "Nkama libwa na ntuku mibale na minei", group: "920-929" },
    { value: 925, word: "Nkama libwa na ntuku mibale na mitano", group: "920-929" },
    { value: 926, word: "Nkama libwa na ntuku mibale na motoba", group: "920-929" },
    { value: 927, word: "Nkama libwa na ntuku mibale na sambo", group: "920-929" },
    { value: 928, word: "Nkama libwa na ntuku mibale na mwambe", group: "920-929" },
    { value: 929, word: "Nkama libwa na ntuku mibale na libwa", group: "920-929" },

    { value: 930, word: "Nkama libwa na ntuku misato", group: "930-939" },
    { value: 931, word: "Nkama libwa na ntuku misato na moko", group: "930-939" },
    { value: 932, word: "Nkama libwa na ntuku misato na mibale", group: "930-939" },
    { value: 933, word: "Nkama libwa na ntuku misato na misato", group: "930-939" },
    { value: 934, word: "Nkama libwa na ntuku misato na minei", group: "930-939" },
    { value: 935, word: "Nkama libwa na ntuku misato na mitano", group: "930-939" },
    { value: 936, word: "Nkama libwa na ntuku misato na motoba", group: "930-939" },
    { value: 937, word: "Nkama libwa na ntuku misato na sambo", group: "930-939" },
    { value: 938, word: "Nkama libwa na ntuku misato na mwambe", group: "930-939" },
    { value: 939, word: "Nkama libwa na ntuku misato na libwa", group: "930-939" },

    { value: 940, word: "Nkama libwa na ntuku minei", group: "940-949" },
    { value: 941, word: "Nkama libwa na ntuku minei na moko", group: "940-949" },
    { value: 942, word: "Nkama libwa na ntuku minei na mibale", group: "940-949" },
    { value: 943, word: "Nkama libwa na ntuku minei na misato", group: "940-949" },
    { value: 944, word: "Nkama libwa na ntuku minei na minei", group: "940-949" },
    { value: 945, word: "Nkama libwa na ntuku minei na mitano", group: "940-949" },
    { value: 946, word: "Nkama libwa na ntuku minei na motoba", group: "940-949" },
    { value: 947, word: "Nkama libwa na ntuku minei na sambo", group: "940-949" },
    { value: 948, word: "Nkama libwa na ntuku minei na mwambe", group: "940-949" },
    { value: 949, word: "Nkama libwa na ntuku minei na libwa", group: "940-949" },

    { value: 950, word: "Nkama libwa na ntuku mitano", group: "950-959" },
    { value: 951, word: "Nkama libwa na ntuku mitano na moko", group: "950-959" },
    { value: 952, word: "Nkama libwa na ntuku mitano na mibale", group: "950-959" },
    { value: 953, word: "Nkama libwa na ntuku mitano na misato", group: "950-959" },
    { value: 954, word: "Nkama libwa na ntuku mitano na minei", group: "950-959" },
    { value: 955, word: "Nkama libwa na ntuku mitano na mitano", group: "950-959" },
    { value: 956, word: "Nkama libwa na ntuku mitano na motoba", group: "950-959" },
    { value: 957, word: "Nkama libwa na ntuku mitano na sambo", group: "950-959" },
    { value: 958, word: "Nkama libwa na ntuku mitano na mwambe", group: "950-959" },
    { value: 959, word: "Nkama libwa na ntuku mitano na libwa", group: "950-959" },

    { value: 960, word: "Nkama libwa na ntuku motoba", group: "960-969" },
    { value: 961, word: "Nkama libwa na ntuku motoba na moko", group: "960-969" },
    { value: 962, word: "Nkama libwa na ntuku motoba na mibale", group: "960-969" },
    { value: 963, word: "Nkama libwa na ntuku motoba na misato", group: "960-969" },
    { value: 964, word: "Nkama libwa na ntuku motoba na minei", group: "960-969" },
    { value: 965, word: "Nkama libwa na ntuku motoba na mitano", group: "960-969" },
    { value: 966, word: "Nkama libwa na ntuku motoba na motoba", group: "960-969" },
    { value: 967, word: "Nkama libwa na ntuku motoba na sambo", group: "960-969" },
    { value: 968, word: "Nkama libwa na ntuku motoba na mwambe", group: "960-969" },
    { value: 969, word: "Nkama libwa na ntuku motoba na libwa", group: "960-969" },

    { value: 970, word: "Nkama libwa na ntuku sambo", group: "970-979" },
    { value: 971, word: "Nkama libwa na ntuku sambo na moko", group: "970-979" },
    { value: 972, word: "Nkama libwa na ntuku sambo na mibale", group: "970-979" },
    { value: 973, word: "Nkama libwa na ntuku sambo na misato", group: "970-979" },
    { value: 974, word: "Nkama libwa na ntuku sambo na minei", group: "970-979" },
    { value: 975, word: "Nkama libwa na ntuku sambo na mitano", group: "970-979" },
    { value: 976, word: "Nkama libwa na ntuku sambo na motoba", group: "970-979" },
    { value: 977, word: "Nkama libwa na ntuku sambo na sambo", group: "970-979" },
    { value: 978, word: "Nkama libwa na ntuku sambo na mwambe", group: "970-979" },
    { value: 979, word: "Nkama libwa na ntuku sambo na libwa", group: "970-979" },

    { value: 980, word: "Nkama libwa na ntuku mwambe", group: "980-989" },
    { value: 981, word: "Nkama libwa na ntuku mwambe na moko", group: "980-989" },
    { value: 982, word: "Nkama libwa na ntuku mwambe na mibale", group: "980-989" },
    { value: 983, word: "Nkama libwa na ntuku mwambe na misato", group: "980-989" },
    { value: 984, word: "Nkama libwa na ntuku mwambe na minei", group: "980-989" },
    { value: 985, word: "Nkama libwa na ntuku mwambe na mitano", group: "980-989" },
    { value: 986, word: "Nkama libwa na ntuku mwambe na motoba", group: "980-989" },
    { value: 987, word: "Nkama libwa na ntuku mwambe na sambo", group: "980-989" },
    { value: 988, word: "Nkama libwa na ntuku mwambe na mwambe", group: "980-989" },
    { value: 989, word: "Nkama libwa na ntuku mwambe na libwa", group: "980-989" },

    { value: 990, word: "Nkama libwa na ntuku libwa", group: "990-999" },
    { value: 991, word: "Nkama libwa na ntuku libwa na moko", group: "990-999" },
    { value: 992, word: "Nkama libwa na ntuku libwa na mibale", group: "990-999" },
    { value: 993, word: "Nkama libwa na ntuku libwa na misato", group: "990-999" },
    { value: 994, word: "Nkama libwa na ntuku libwa na minei", group: "990-999" },
    { value: 995, word: "Nkama libwa na ntuku libwa na mitano", group: "990-999" },
    { value: 996, word: "Nkama libwa na ntuku libwa na motoba", group: "990-999" },
    { value: 997, word: "Nkama libwa na ntuku libwa na sambo", group: "990-999" },
    { value: 998, word: "Nkama libwa na ntuku libwa na mwambe", group: "990-999" },
    { value: 999, word: "Nkama libwa na ntuku libwa na libwa", group: "990-999" },

    // Extend further as needed
    { value: 1000, word: "Nkoto", group: "1000-1009" },
    { value: 1001, word: "Nkoto na moko", group: "1000-1009" },
    { value: 1002, word: "Nkoto na mibale", group: "1000-1009" },
    { value: 1003, word: "Nkoto na misato", group: "1000-1009" },
    { value: 1004, word: "Nkoto na minei", group: "1000-1009" },
    { value: 1005, word: "Nkoto na mitano", group: "1000-1009" },
    { value: 1006, word: "Nkoto na motoba", group: "1000-1009" },
    { value: 1007, word: "Nkoto na sambo", group: "1000-1009" },
    { value: 1008, word: "Nkoto na mwambe", group: "1000-1009" },
    { value: 1009, word: "Nkoto na libwa", group: "1000-1009" },

    { value: 1010, word: "Nkoto na zomi", group: "1010-1019" },
    { value: 1011, word: "Nkoto na zomi na moko", group: "1010-1019" },
    { value: 1012, word: "Nkoto na zomi na mibale", group: "1010-1019" },
    { value: 1013, word: "Nkoto na zomi na misato", group: "1010-1019" },
    { value: 1014, word: "Nkoto na zomi na minei", group: "1010-1019" },
    { value: 1015, word: "Nkoto na zomi na mitano", group: "1010-1019" },
    { value: 1016, word: "Nkoto na zomi na motoba", group: "1010-1019" },
    { value: 1017, word: "Nkoto na zomi na sambo", group: "1010-1019" },
    { value: 1018, word: "Nkoto na zomi na mwambe", group: "1010-1019" },
    { value: 1019, word: "Nkoto na zomi na libwa", group: "1010-1019" },

    { value: 1020, word: "Nkoto na ntuku mibale", group: "1020-1029" },
    { value: 1021, word: "Nkoto na ntuku mibale na moko", group: "1020-1029" },
    { value: 1022, word: "Nkoto na ntuku mibale na mibale", group: "1020-1029" },
    { value: 1023, word: "Nkoto na ntuku mibale na misato", group: "1020-1029" },
    { value: 1024, word: "Nkoto na ntuku mibale na minei", group: "1020-1029" },
    { value: 1025, word: "Nkoto na ntuku mibale na mitano", group: "1020-1029" },
    { value: 1026, word: "Nkoto na ntuku mibale na motoba", group: "1020-1029" },
    { value: 1027, word: "Nkoto na ntuku mibale na sambo", group: "1020-1029" },
    { value: 1028, word: "Nkoto na ntuku mibale na mwambe", group: "1020-1029" },
    { value: 1029, word: "Nkoto na ntuku mibale na libwa", group: "1020-1029" },

    { value: 1030, word: "Nkoto na ntuku misato", group: "1030-1039" },
    { value: 1031, word: "Nkoto na ntuku misato na moko", group: "1030-1039" },
    { value: 1032, word: "Nkoto na ntuku misato na mibale", group: "1030-1039" },
    { value: 1033, word: "Nkoto na ntuku misato na misato", group: "1030-1039" },
    { value: 1034, word: "Nkoto na ntuku misato na minei", group: "1030-1039" },
    { value: 1035, word: "Nkoto na ntuku misato na mitano", group: "1030-1039" },
    { value: 1036, word: "Nkoto na ntuku misato na motoba", group: "1030-1039" },
    { value: 1037, word: "Nkoto na ntuku misato na sambo", group: "1030-1039" },
    { value: 1038, word: "Nkoto na ntuku misato na mwambe", group: "1030-1039" },
    { value: 1039, word: "Nkoto na ntuku misato na libwa", group: "1030-1039" },

    { value: 1040, word: "Nkoto na ntuku minei", group: "1040-1049" },

    { value: 1050, word: "Nkoto na ntuku mitano", group: "1050-1059" },

    { value: 1060, word: "Nkoto na ntuku motoba", group: "1060-1069" },

    { value: 1070, word: "Nkoto na ntuku sambo", group: "1070-1079" },
    { value: 1071, word: "Nkoto na ntuku sambo na moko", group: "1070-1079" },
    { value: 1072, word: "Nkoto na ntuku sambo na mibale", group: "1070-1079" },
    { value: 1073, word: "Nkoto na ntuku sambo na misato", group: "1070-1079" },
    { value: 1074, word: "Nkoto na ntuku sambo na minei", group: "1070-1079" },
    { value: 1075, word: "Nkoto na ntuku sambo na mitano", group: "1070-1079" },
    { value: 1076, word: "Nkoto na ntuku sambo na motoba", group: "1070-1079" },
    { value: 1077, word: "Nkoto na ntuku sambo na sambo", group: "1070-1079" },
    { value: 1078, word: "Nkoto na ntuku sambo na mwambe", group: "1070-1079" },
    { value: 1079, word: "Nkoto na ntuku sambo na libwa", group: "1070-1079" },

    { value: 1080, word: "Nkoto na ntuku mwambe", group: "1080-1089" },
    { value: 1081, word: "Nkoto na ntuku mwambe na moko", group: "1080-1089" },
    { value: 1082, word: "Nkoto na ntuku mwambe na mibale", group: "1080-1089" },
    { value: 1083, word: "Nkoto na ntuku mwambe na misato", group: "1080-1089" },
    { value: 1084, word: "Nkoto na ntuku mwambe na minei", group: "1080-1089" },
    { value: 1085, word: "Nkoto na ntuku mwambe na mitano", group: "1080-1089" },
    { value: 1086, word: "Nkoto na ntuku mwambe na motoba", group: "1080-1089" },
    { value: 1087, word: "Nkoto na ntuku mwambe na sambo", group: "1080-1089" },
    { value: 1088, word: "Nkoto na ntuku mwambe na mwambe", group: "1080-1089" },
    { value: 1089, word: "Nkoto na ntuku mwambe na libwa", group: "1080-1089" },

    { value: 1090, word: "Nkoto na ntuku libwa", group: "1090-1099" },
    { value: 1091, word: "Nkoto na ntuku libwa na moko", group: "1090-1099" },
    { value: 1092, word: "Nkoto na ntuku libwa na mibale", group: "1090-1099" },
    { value: 1093, word: "Nkoto na ntuku libwa na misato", group: "1090-1099" },
    { value: 1094, word: "Nkoto na ntuku libwa na minei", group: "1090-1099" },
    { value: 1095, word: "Nkoto na ntuku libwa na mitano", group: "1090-1099" },
    { value: 1096, word: "Nkoto na ntuku libwa na motoba", group: "1090-1099" },
    { value: 1097, word: "Nkoto na ntuku libwa na sambo", group: "1090-1099" },
    { value: 1098, word: "Nkoto na ntuku libwa na mwambe", group: "1090-1099" },
    { value: 1099, word: "Nkoto na ntuku libwa na libwa", group: "1090-1099" },

    { value: 1100, word: "Nkoto na nkama", group: "1100-1109" },
    { value: 1101, word: "Nkoto na nkama moko na moko", group: "1100-1109" },
    { value: 1102, word: "Nkoto na nkama moko na mibale", group: "1100-1109" },
    { value: 1103, word: "Nkoto na nkama moko na misato", group: "1100-1109" },
    { value: 1104, word: "Nkoto na nkama moko na minei", group: "1100-1109" },
    { value: 1105, word: "Nkoto na nkama moko na mitano", group: "1100-1109" },
    { value: 1106, word: "Nkoto na nkama moko na motoba", group: "1100-1109" },
    { value: 1107, word: "Nkoto na nkama moko na sambo", group: "1100-1109" },
    { value: 1108, word: "Nkoto na nkama moko na mwambe", group: "1100-1109" },
    { value: 1109, word: "Nkoto na nkama moko na libwa", group: "1100-1109" },

    { value: 1110, word: "Nkoto na nkama na zomi", group: "1110-1119" },
    { value: 1111, word: "Nkoto na nkama na zomi na moko", group: "1110-1119" },
    { value: 1112, word: "Nkoto na nkama na zomi na mibale", group: "1110-1119" },
    { value: 1113, word: "Nkoto na nkama na zomi na misato", group: "1110-1119" },
    { value: 1114, word: "Nkoto na nkama na zomi na minei", group: "1110-1119" },
    { value: 1115, word: "Nkoto na nkama na zomi na mitano", group: "1110-1119" },
    { value: 1116, word: "Nkoto na nkama na zomi na motoba", group: "1110-1119" },
    { value: 1117, word: "Nkoto na nkama na zomi na sambo", group: "1110-1119" },
    { value: 1118, word: "Nkoto na nkama na zomi na mwambe", group: "1110-1119" },
    { value: 1119, word: "Nkoto na nkama na zomi na libwa", group: "1110-1119" },

    { value: 1120, word: "Nkoto na nkama na ntuku mibale", group: "1120-1129" },
    { value: 1121, word: "Nkoto na nkama na ntuku mibale na moko", group: "1120-1129" },
    { value: 1122, word: "Nkoto na nkama na ntuku mibale na mibale", group: "1120-1129" },
    { value: 1123, word: "Nkoto na nkama na ntuku mibale na misato", group: "1120-1129" },
    { value: 1124, word: "Nkoto na nkama na ntuku mibale na minei", group: "1120-1129" },
    { value: 1125, word: "Nkoto na nkama na ntuku mibale na mitano", group: "1120-1129" },
    { value: 1126, word: "Nkoto na nkama na ntuku mibale na motoba", group: "1120-1129" },
    { value: 1127, word: "Nkoto na nkama na ntuku mibale na sambo", group: "1120-1129" },
    { value: 1128, word: "Nkoto na nkama na ntuku mibale na mwambe", group: "1120-1129" },
    { value: 1129, word: "Nkoto na nkama na ntuku mibale na libwa", group: "1120-1129" },

    { value: 1130, word: "Nkoto na nkama na ntuku misato", group: "1130-1139" },
    { value: 1132, word: "Nkoto na nkama na ntuku misato na mibale", group: "1130-1139" },
    { value: 1133, word: "Nkoto na nkama na ntuku misato na misato", group: "1130-1139" },
    { value: 1134, word: "Nkoto na nkama na ntuku misato na minei", group: "1130-1139" },
    { value: 1135, word: "Nkoto na nkama na ntuku misato na mitano", group: "1130-1139" },
    { value: 1136, word: "Nkoto na nkama na ntuku misato na motoba", group: "1130-1139" },
    { value: 1137, word: "Nkoto na nkama na ntuku misato na sambo", group: "1130-1139" },
    { value: 1138, word: "Nkoto na nkama na ntuku misato na mwambe", group: "1130-1139" },
    { value: 1139, word: "Nkoto na nkama na ntuku misato na libwa", group: "1130-1139" },

    { value: 1140, word: "Nkoto na nkama na ntuku minei", group: "1140-1149" },
    { value: 1141, word: "Nkoto na nkama na ntuku minei na moko", group: "1140-1149" },
    { value: 1142, word: "Nkoto na nkama na ntuku minei na mibale", group: "1140-1149" },
    { value: 1143, word: "Nkoto na nkama na ntuku minei na misato", group: "1140-1149" },
    { value: 1144, word: "Nkoto na nkama na ntuku minei na minei", group: "1140-1149" },
    { value: 1145, word: "Nkoto na nkama na ntuku minei na mitano", group: "1140-1149" },
    { value: 1146, word: "Nkoto na nkama na ntuku minei na motoba", group: "1140-1149" },
    { value: 1147, word: "Nkoto na nkama na ntuku minei na sambo", group: "1140-1149" },
    { value: 1148, word: "Nkoto na nkama na ntuku minei na mwambe", group: "1140-1149" },
    { value: 1149, word: "Nkoto na nkama na ntuku minei na libwa", group: "1140-1149" },

    { value: 1150, word: "Nkoto na nkama na ntuku mitano", group: "1150-1159" },
    { value: 1151, word: "Nkoto na nkama na ntuku mitano na moko", group: "1150-1159" },
    { value: 1152, word: "Nkoto na nkama na ntuku mitano na mibale", group: "1150-1159" },
    { value: 1153, word: "Nkoto na nkama na ntuku mitano na misato", group: "1150-1159" },
    { value: 1154, word: "Nkoto na nkama na ntuku mitano na minei", group: "1150-1159" },
    { value: 1155, word: "Nkoto na nkama na ntuku mitano na mitano", group: "1150-1159" },
    { value: 1156, word: "Nkoto na nkama na ntuku mitano na motoba", group: "1150-1159" },
    { value: 1157, word: "Nkoto na nkama na ntuku mitano na sambo", group: "1150-1159" },
    { value: 1158, word: "Nkoto na nkama na ntuku mitano na mwambe", group: "1150-1159" },
    { value: 1159, word: "Nkoto na nkama na ntuku mitano na libwa", group: "1150-1159" },

    { value: 1160, word: "Nkoto na nkama na ntuku motoba", group: "1160-1169" },

    { value: 1170, word: "Nkoto na nkama na ntuku sambo", group: "1170-1179" },

    { value: 1180, word: "Nkoto na nkama na ntuku mwambe", group: "1180-1189" },
    { value: 1181, word: "Nkoto na nkama na ntuku mwambe na moko", group: "1180-1189" },
    { value: 1182, word: "Nkoto na nkama na ntuku mwambe na mibale", group: "1180-1189" },
    { value: 1183, word: "Nkoto na nkama na ntuku mwambe na misato", group: "1180-1189" },
    { value: 1184, word: "Nkoto na nkama na ntuku mwambe na minei", group: "1180-1189" },
    { value: 1185, word: "Nkoto na nkama na ntuku mwambe na mitano", group: "1180-1189" },
    { value: 1186, word: "Nkoto na nkama na ntuku mwambe na motoba", group: "1180-1189" },
    { value: 1187, word: "Nkoto na nkama na ntuku mwambe na sambo", group: "1180-1189" },
    { value: 1188, word: "Nkoto na nkama na ntuku mwambe na mwambe", group: "1180-1189" },
    { value: 1189, word: "Nkoto na nkama na ntuku mwambe na libwa", group: "1180-1189" },

    { value: 1190, word: "Nkoto na nkama na ntuku libwa", group: "1190-1199" },
    { value: 1191, word: "Nkoto na nkama na ntuku libwa na moko", group: "1190-1199" },
    { value: 1192, word: "Nkoto na nkama na ntuku libwa na mibale", group: "1190-1199" },
    { value: 1193, word: "Nkoto na nkama na ntuku libwa na misato", group: "1190-1199" },
    { value: 1194, word: "Nkoto na nkama na ntuku libwa na minei", group: "1190-1199" },
    { value: 1195, word: "Nkoto na nkama na ntuku libwa na mitano", group: "1190-1199" },
    { value: 1196, word: "Nkoto na nkama na ntuku libwa na motoba", group: "1190-1199" },
    { value: 1197, word: "Nkoto na nkama na ntuku libwa na sambo", group: "1190-1199" },
    { value: 1198, word: "Nkoto na nkama na ntuku libwa na mwambe", group: "1190-1199" },
    { value: 1199, word: "Nkoto na nkama na ntuku libwa na libwa", group: "1190-1199" },

    { value: 1200, word: "Nkoto na nkama mibale", group: "1200-1209" },

    { value: 1210, word: "Nkoto na nkama mibale na zomi", group: "1210-1219" },

    { value: 1220, word: "Nkoto na nkama mibale na ntuku mibale", group: "1220-1229" },

    { value: 1230, word: "Nkoto na nkama mibale na ntuku misato", group: "1230-1239" },

    { value: 1240, word: "Nkoto na nkama mibale na ntuku minei", group: "1240-1249" },

    { value: 1250, word: "Nkoto na nkama mibale na ntuku mitano", group: "1250-1259" },

    { value: 1260, word: "Nkoto na nkama mibale na ntuku motoba", group: "1260-1269" },

    { value: 1270, word: "Nkoto na nkama mibale na ntuku sambo", group: "1270-1279" },
    { value: 1271, word: "Nkoto na nkama mibale na ntuku sambo na moko", group: "1270-1279" },
    { value: 1272, word: "Nkoto na nkama mibale na ntuku sambo na mibale", group: "1270-1279" },
    { value: 1273, word: "Nkoto na nkama mibale na ntuku sambo na misato", group: "1270-1279" },

    { value: 1280, word: "Nkoto na nkama mibale na ntuku mwambe", group: "1280-1289" },

    { value: 1290, word: "Nkoto na nkama mibale na ntuku libwa", group: "1290-1299" },

    { value: 1300, word: "Nkoto na nkama misato", group: "1300-1309" },

    { value: 1310, word: "Nkoto na nkama misato na zomi", group: "1310-1319" },

    { value: 1320, word: "Nkoto na nkama misato na ntuku mibale", group: "1320-1329" },

    { value: 1330, word: "Nkoto na nkama misato na ntuku misato", group: "1330-1339" },

    { value: 1340, word: "Nkoto na nkama misato na ntuku minei", group: "1340-1349" },

    { value: 1350, word: "Nkoto na nkama misato na ntuku mitano", group: "1350-1359" },

    { value: 1360, word: "Nkoto na nkama misato na ntuku motoba", group: "1360-1369" },

    { value: 1370, word: "Nkoto na nkama misato na ntuku sambo", group: "1370-1379" },

    { value: 1380, word: "Nkoto na nkama misato na ntuku mwambe", group: "1380-1389" },

    { value: 1390, word: "Nkoto na nkama misato na ntuku libwa", group: "1390-1399" },

    { value: 1400, word: "Nkoto na nkama motoba", group: "1400-1409" },

    { value: 1410, word: "Nkoto na nkama motoba na zomi", group: "1410-1419" },

    { value: 1420, word: "Nkoto na nkama motoba na ntuku mibale", group: "1420-1429" },

    { value: 1430, word: "Nkoto na nkama motoba na ntuku misato", group: "1430-1439" },

    { value: 1440, word: "Nkoto na nkama motoba na ntuku minei", group: "1440-1449" },

    { value: 1450, word: "Nkoto na nkama motoba na ntuku mitano", group: "1450-1459" },

    { value: 1460, word: "Nkoto na nkama motoba na ntuku motoba", group: "1460-1469" },

    { value: 1470, word: "Nkoto na nkama motoba na ntuku sambo", group: "1470-1479" },

    { value: 1480, word: "Nkoto na nkama motoba na ntuku mwambe", group: "1480-1489" },

    { value: 1490, word: "Nkoto na nkama motoba na ntuku libwa", group: "1490-1499" },

    { value: 1500, word: "Nkoto na nkama sambo", group: "1500-1509" },

    { value: 1510, word: "Nkoto na nkama sambo na zomi", group: "1510-1519" },

    { value: 1520, word: "Nkoto na nkama sambo na ntuku mibale", group: "1520-1529" },

    { value: 1530, word: "Nkoto na nkama sambo na ntuku misato", group: "1530-1539" },

    { value: 1540, word: "Nkoto na nkama sambo na ntuku minei", group: "1540-1549" },

    { value: 1550, word: "Nkoto na nkama sambo na ntuku mitano", group: "1550-1559" },

    { value: 1560, word: "Nkoto na nkama sambo na ntuku motoba", group: "1560-1569" },

    { value: 1570, word: "Nkoto na nkama sambo na ntuku sambo", group: "1570-1579" },

    { value: 1580, word: "Nkoto na nkama sambo na ntuku mwambe", group: "1580-1589" },

    { value: 1590, word: "Nkoto na nkama sambo na ntuku libwa", group: "1590-1599" },

    { value: 1600, word: "Nkoto na nkama libwa", group: "1600-1609" },

    { value: 1610, word: "Nkoto na nkama libwa na zomi", group: "1610-1619" },

    { value: 1620, word: "Nkoto na nkama libwa na ntuku mibale", group: "1620-1629" },

    { value: 1630, word: "Nkoto na nkama libwa na ntuku misato", group: "1630-1639" },

    { value: 1640, word: "Nkoto na nkama libwa na ntuku minei", group: "1640-1649" },

    { value: 1650, word: "Nkoto na nkama libwa na ntuku mitano", group: "1650-1659" },

    { value: 1660, word: "Nkoto na nkama libwa na ntuku motoba", group: "1660-1669" },

    { value: 1670, word: "Nkoto na nkama libwa na ntuku sambo", group: "1670-1679" },

    { value: 1680, word: "Nkoto na nkama libwa na ntuku mwambe", group: "1680-1689" },

    { value: 1690, word: "Nkoto na nkama libwa na ntuku libwa", group: "1690-1699" },

    { value: 1700, word: "Nkoto na nkama sambo", group: "1700-1709" },

    { value: 1710, word: "Nkoto na nkama sambo na zomi", group: "1710-1719" },

    { value: 1720, word: "Nkoto na nkama sambo na ntuku mibale", group: "1720-1729" },

    { value: 1730, word: "Nkoto na nkama sambo na ntuku misato", group: "1730-1739" },

    { value: 1740, word: "Nkoto na nkama sambo na ntuku minei", group: "1740-1749" },

    { value: 1750, word: "Nkoto na nkama sambo na ntuku mitano", group: "1750-1759" },

    { value: 1760, word: "Nkoto na nkama sambo na ntuku motoba", group: "1760-1769" },

    { value: 1770, word: "Nkoto na nkama sambo na ntuku sambo", group: "1770-1779" },

    { value: 1780, word: "Nkoto na nkama sambo na ntuku mwambe", group: "1780-1789" },

    { value: 1790, word: "Nkoto na nkama sambo na ntuku libwa", group: "1790-1799" },

    { value: 1800, word: "Nkoto na nkama mwambe", group: "1800-1809" },

    { value: 1810, word: "Nkoto na nkama mwambe na zomi", group: "1810-1819" },

    { value: 1820, word: "Nkoto na nkama mwambe na ntuku mibale", group: "1820-1829" },

    { value: 1830, word: "Nkoto na nkama mwambe na ntuku misato", group: "1830-1839" },

    { value: 1840, word: "Nkoto na nkama mwambe na ntuku minei", group: "1840-1849" },

    { value: 1850, word: "Nkoto na nkama mwambe na ntuku mitano", group: "1850-1859" },

    { value: 1860, word: "Nkoto na nkama mwambe na ntuku motoba", group: "1860-1869" },

    { value: 1870, word: "Nkoto na nkama mwambe na ntuku sambo", group: "1870-1879" },

    { value: 1880, word: "Nkoto na nkama mwambe na ntuku mwambe", group: "1880-1889" },

    { value: 1890, word: "Nkoto na nkama mwambe na ntuku libwa ", group: "1890-1899" },

    { value: 1900, word: "Nkoto na nkama libwa ", group: "1900-1909" },

    { value: 1910, word: "Nkoto na nkama libwa na zomi", group: "1910-1919" },

    { value: 1920, word: "Nkoto na nkama libwa na ntuku mibale", group: "1920-1929" },

    { value: 1930, word: "Nkoto na nkama libwa na ntuku misato", group: "1930-1939" },

    { value: 1940, word: "Nkoto na nkama libwa na ntuku minei", group: "1940-1949" },

    { value: 1950, word: "Nkoto na nkama libwa na ntuku mitano", group: "1950-1959" },

    { value: 1960, word: "Nkoto na nkama libwa na ntuku motoba", group: "1960-1969" },

    { value: 1970, word: "Nkoto na nkama libwa na ntuku sambo", group: "1970-1979" },

    { value: 1980, word: "Nkoto na nkama libwa na ntuku mwambe", group: "1980-1989" },

    { value: 1990, word: "Nkoto na nkama libwa na ntuku libwa", group: "1990-1999" },

    { value: 2000, word: "Nkoto mibale", group: "2000-2009" },
    { value: 2001, word: "Nkoto mibale na moko", group: "2000-2009" },
    { value: 2002, word: "Nkoto mibale na mibale", group: "2000-2009" },
    { value: 2003, word: "Nkoto mibale na misato", group: "2000-2009" },
    { value: 2004, word: "Nkoto mibale na minei", group: "2000-2009" },
    { value: 2005, word: "Nkoto mibale na mitano", group: "2000-2009" },
    { value: 2006, word: "Nkoto mibale na motoba", group: "2000-2009" },
    { value: 2007, word: "Nkoto mibale na sambo", group: "2000-2009" },
    { value: 2008, word: "Nkoto mibale na mwambe", group: "2000-2009" },
    { value: 2009, word: "Nkoto mibale na libwa", group: "2000-2009" },

    { value: 2010, word: "Nkoto mibale na zomi", group: "2010-2019" },
    { value: 2011, word: "Nkoto mibale na zomi na moko", group: "2010-2019" },
    { value: 2012, word: "Nkoto mibale na zomi na mibale", group: "2010-2019" },
    { value: 2013, word: "Nkoto mibale na zomi na misato", group: "2010-2019" },
    { value: 2014, word: "Nkoto mibale na zomi na minei", group: "2010-2019" },
    { value: 2015, word: "Nkoto mibale na zomi na mitano", group: "2010-2019" },
    { value: 2016, word: "Nkoto mibale na zomi na motoba", group: "2010-2019" },
    { value: 2017, word: "Nkoto mibale na zomi na sambo", group: "2010-2019" },
    { value: 2018, word: "Nkoto mibale na zomi na mwambe", group: "2010-2019" },
    { value: 2019, word: "Nkoto mibale na zomi na libwa", group: "2010-2019" },

    { value: 2020, word: "Nkoto mibale na ntuku mibale", group: "2020-2029" },
    { value: 2021, word: "Nkoto mibale na ntuku mibale na moko", group: "2020-2029" },
    { value: 2022, word: "Nkoto mibale na ntuku mibale na mibale", group: "2020-2029" },
    { value: 2023, word: "Nkoto mibale na ntuku mibale na misato", group: "2020-2029" },
    { value: 2024, word: "Nkoto mibale na ntuku mibale na minei", group: "2020-2029" },
    { value: 2025, word: "Nkoto mibale na ntuku mibale na mitano", group: "2020-2029" },
    { value: 2026, word: "Nkoto mibale na ntuku mibale na motoba", group: "2020-2029" },
    { value: 2027, word: "Nkoto mibale na ntuku mibale na sambo", group: "2020-2029" },
    { value: 2028, word: "Nkoto mibale na ntuku mibale na mwambe", group: "2020-2029" },
    { value: 2029, word: "Nkoto mibale na ntuku mibale na libwa", group: "2020-2029" },

    { value: 2030, word: "Nkoto mibale na ntuku misato", group: "2030-2039" },
    { value: 2031, word: "Nkoto mibale na ntuku misato na moko", group: "2030-2039" },
    { value: 2032, word: "Nkoto mibale na ntuku misato na mibale", group: "2030-2039" },
    { value: 2033, word: "Nkoto mibale na ntuku misato na misato", group: "2030-2039" },
    { value: 2034, word: "Nkoto mibale na ntuku misato na minei", group: "2030-2039" },
    { value: 2035, word: "Nkoto mibale na ntuku misato na mitano", group: "2030-2039" },
    { value: 2036, word: "Nkoto mibale na ntuku misato na motoba", group: "2030-2039" },
    { value: 2037, word: "Nkoto mibale na ntuku misato na sambo", group: "2030-2039" },
    { value: 2038, word: "Nkoto mibale na ntuku misato na mwambe", group: "2030-2039" },
    { value: 2039, word: "Nkoto mibale na ntuku misato na libwa", group: "2030-2039" },

    { value: 2040, word: "Nkoto mibale na ntuku minei", group: "2040-2049" },
    { value: 2041, word: "Nkoto mibale na ntuku minei na moko", group: "2040-2049" },
    { value: 2042, word: "Nkoto mibale na ntuku minei na mibale", group: "2040-2049" },
    { value: 2043, word: "Nkoto mibale na ntuku minei na misato", group: "2040-2049" },
    { value: 2044, word: "Nkoto mibale na ntuku minei na minei", group: "2040-2049" },
    { value: 2045, word: "Nkoto mibale na ntuku minei na mitano", group: "2040-2049" },
    { value: 2046, word: "Nkoto mibale na ntuku minei na motoba", group: "2040-2049" },
    { value: 2047, word: "Nkoto mibale na ntuku minei na sambo", group: "2040-2049" },
    { value: 2048, word: "Nkoto mibale na ntuku minei na mwambe", group: "2040-2049" },
    { value: 2049, word: "Nkoto mibale na ntuku minei na libwa", group: "2040-2049" },

    { value: 2050, word: "Nkoto mibale na ntuku mitano", group: "2050-2059" },
    { value: 2051, word: "Nkoto mibale na ntuku mitano na moko", group: "2050-2059" },
    { value: 2052, word: "Nkoto mibale na ntuku mitano na mibale", group: "2050-2059" },
    { value: 2053, word: "Nkoto mibale na ntuku mitano na misato", group: "2050-2059" },
    { value: 2054, word: "Nkoto mibale na ntuku mitano na minei", group: "2050-2059" },
    { value: 2055, word: "Nkoto mibale na ntuku mitano na mitano", group: "2050-2059" },
    { value: 2056, word: "Nkoto mibale na ntuku mitano na motoba", group: "2050-2059" },
    { value: 2057, word: "Nkoto mibale na ntuku mitano na sambo", group: "2050-2059" },
    { value: 2058, word: "Nkoto mibale na ntuku mitano na mwambe", group: "2050-2059" },
    { value: 2059, word: "Nkoto mibale na ntuku mitano na libwa", group: "2050-2059" },

    { value: 2060, word: "Nkoto mibale na ntuku motoba", group: "2060-2069" },
    { value: 2061, word: "Nkoto mibale na ntuku motoba na moko", group: "2060-2069" },
    { value: 2062, word: "Nkoto mibale na ntuku motoba na mibale", group: "2060-2069" },
    { value: 2063, word: "Nkoto mibale na ntuku motoba na misato", group: "2060-2069" },
    { value: 2064, word: "Nkoto mibale na ntuku motoba na minei", group: "2060-2069" },
    { value: 2065, word: "Nkoto mibale na ntuku motoba na mitano", group: "2060-2069" },
    { value: 2066, word: "Nkoto mibale na ntuku motoba na motoba", group: "2060-2069" },
    { value: 2067, word: "Nkoto mibale na ntuku motoba na sambo", group: "2060-2069" },
    { value: 2068, word: "Nkoto mibale na ntuku motoba na mwambe", group: "2060-2069" },
    { value: 2069, word: "Nkoto mibale na ntuku motoba na libwa", group: "2060-2069" },

    { value: 2070, word: "Nkoto mibale na ntuku sambo", group: "2070-2079" },
    { value: 2071, word: "Nkoto mibale na ntuku sambo na moko", group: "2070-2079" },
    { value: 2072, word: "Nkoto mibale na ntuku sambo na mibale", group: "2070-2079" },
    { value: 2073, word: "Nkoto mibale na ntuku sambo na misato", group: "2070-2079" },
    { value: 2074, word: "Nkoto mibale na ntuku sambo na minei", group: "2070-2079" },
    { value: 2075, word: "Nkoto mibale na ntuku sambo na mitano", group: "2070-2079" },
    { value: 2076, word: "Nkoto mibale na ntuku sambo na motoba", group: "2070-2079" },
    { value: 2077, word: "Nkoto mibale na ntuku sambo na sambo", group: "2070-2079" },
    { value: 2078, word: "Nkoto mibale na ntuku sambo na mwambe", group: "2070-2079" },
    { value: 2079, word: "Nkoto mibale na ntuku sambo na libwa", group: "2070-2079" },

    { value: 2080, word: "Nkoto mibale na ntuku mwambe", group: "2080-2089" },
    { value: 2081, word: "Nkoto mibale na ntuku mwambe na moko", group: "2080-2089" },
    { value: 2082, word: "Nkoto mibale na ntuku mwambe na mibale", group: "2080-2089" },
    { value: 2083, word: "Nkoto mibale na ntuku mwambe na misato", group: "2080-2089" },
    { value: 2084, word: "Nkoto mibale na ntuku mwambe na minei", group: "2080-2089" },
    { value: 2085, word: "Nkoto mibale na ntuku mwambe na mitano", group: "2080-2089" },
    { value: 2086, word: "Nkoto mibale na ntuku mwambe na motoba", group: "2080-2089" },
    { value: 2087, word: "Nkoto mibale na ntuku mwambe na sambo", group: "2080-2089" },
    { value: 2088, word: "Nkoto mibale na ntuku mwambe na mwambe", group: "2080-2089" },
    { value: 2089, word: "Nkoto mibale na ntuku mwambe na libwa", group: "2080-2089" },

    { value: 2090, word: "Nkoto mibale na ntuku libwa", group: "2090-2099" },
    { value: 2091, word: "Nkoto mibale na ntuku libwa na moko", group: "2090-2099" },
    { value: 2092, word: "Nkoto mibale na ntuku libwa na mibale", group: "2090-2099" },
    { value: 2093, word: "Nkoto mibale na ntuku libwa na misato", group: "2090-2099" },
    { value: 2094, word: "Nkoto mibale na ntuku libwa na minei", group: "2090-2099" },
    { value: 2095, word: "Nkoto mibale na ntuku libwa na mitano", group: "2090-2099" },
    { value: 2096, word: "Nkoto mibale na ntuku libwa na motoba", group: "2090-2099" },
    { value: 2097, word: "Nkoto mibale na ntuku libwa na sambo", group: "2090-2099" },
    { value: 2098, word: "Nkoto mibale na ntuku libwa na mwambe", group: "2090-2099" },
    { value: 2099, word: "Nkoto mibale na ntuku libwa na libwa", group: "2090-2099" },

    { value: 2100, word: "Nkoto mibale na nkama", group: "2100-2109" },

    { value: 2110, word: "Nkoto mibale na nkama na zomi", group: "2110-2119" },

    { value: 2120, word: "Nkoto mibale na nkama na ntuku mibale", group: "2120-2129" },

    { value: 2130, word: "Nkoto mibale na nkama na ntuku misato", group: "2130-2139" },

    { value: 2140, word: "Nkoto mibale na nkama na ntuku minei", group: "2140-2149" },

    { value: 2150, word: "Nkoto mibale na nkama na ntuku mitano", group: "2150-2159" },

    { value: 2160, word: "Nkoto mibale na nkama na ntuku motoba", group: "2160-2169" },

    { value: 2170, word: "Nkoto mibale na nkama na ntuku sambo", group: "2170-2179" },

    { value: 2180, word: "Nkoto mibale na nkama na ntuku mwambe", group: "2180-2189" },

    { value: 2190, word: "Nkoto mibale na nkama na ntuku libwa", group: "2190-2199" },

    { value: 2200, word: "Nkoto mibale na nkama mibale ", group: "2200-2209" },

    { value: 2210, word: "Nkoto mibale na nkama mibale na zomi", group: "2210-2219" },

    { value: 2220, word: "Nkoto mibale na nkama mibale na ntuku mibale", group: "2220-2229" },

    { value: 2230, word: "Nkoto mibale na nkama mibale na ntuku misato", group: "2230-2239" },

    { value: 2240, word: "Nkoto mibale na nkama mibale na ntuku  minei", group: "2240-2249" },

    { value: 2250, word: "Nkoto mibale na nkama mibale na ntuku mitano", group: "2250-2259" },

    { value: 2260, word: "Nkoto mibale na nkama mibale na ntuku motoba", group: "2260-2269" },

    { value: 2270, word: "Nkoto mibale na nkama mibale na ntuku libwa na ntuku sambo", group: "2270-2279" },

    { value: 2280, word: "Nkoto mibale na nkama mibale na ntuku libwa na ntuku mwambe", group: "2280-2289" },

    { value: 2290, word: "Nkoto mibale na nkama mibale na ntuku libwa na ntuku libwa", group: "2290-2299" },

    { value: 2300, word: "Nkoto mibale na nkama misato na moko", group: "2300-2309" },

    { value: 2310, word: "Nkoto mibale na nkama misato na zomi", group: "2310-2319" },

    { value: 2320, word: "Nkoto mibale na nkama misato na ntuku mibale", group: "2320-2329" },

    { value: 2330, word: "Nkoto mibale na nkama misato na ntuku misato", group: "2330-2339" },

    { value: 2340, word: "Nkoto mibale na nkama misato na ntuku minei", group: "2340-2349" },

    { value: 2350, word: "Nkoto mibale na nkama misato na ntuku mitano", group: "2350-2359" },

    { value: 2360, word: "Nkoto mibale na nkama misato na ntuku motoba", group: "2360-2369" },

    { value: 2370, word: "Nkoto mibale na nkama misato na ntuku sambo", group: "2370-2379" },

    { value: 2380, word: "Nkoto mibale na nkama misato na ntuku mwambe", group: "2380-2389" },

    { value: 2390, word: "Nkoto mibale na nkama misato na ntuku libwa", group: "2390-2399" },

    { value: 2400, word: "Nkoto mibale na nkama minei", group: "2400-2409" },

    { value: 2410, word: "Nkoto mibale na nkama minei na zomi", group: "2410-2419" },

    { value: 2420, word: "Nkoto mibale na nkama minei na ntuku mibale", group: "2420-2429" },

    { value: 2430, word: "Nkoto mibale na nkama minei na ntuku misato", group: "2430-2439" },

    { value: 2440, word: "Nkoto mibale na nkama minei na ntuku minei", group: "2440-2449" },

    { value: 2450, word: "Nkoto mibale na nkama minei na ntuku mitano", group: "2450-2459" },

    { value: 2460, word: "Nkoto mibale na nkama minei na ntuku motoba", group: "2460-2469" },

    { value: 2470, word: "Nkoto mibale na nkama minei na ntuku sambo", group: "2470-2479" },

    { value: 2480, word: "Nkoto mibale na nkama minei na ntuku mwambe", group: "2480-2489" },

    { value: 2490, word: "Nkoto mibale na nkama minei na ntuku libwa", group: "2490-2499" },

    { value: 2500, word: "Nkoto mibale na nkama mitano", group: "2500-2509" },

    { value: 2510, word: "Nkoto mibale na nkama mitano na zomi", group: "2510-2519" },

    { value: 2520, word: "Nkoto mibale na nkama mitano na ntuku mibale", group: "2520-2529" },

    { value: 2530, word: "Nkoto mibale na nkama mitano na ntuku misato", group: "2530-2539" },

    { value: 2540, word: "Nkoto mibale na nkama mitano na ntuku minei", group: "2540-2549" },

    { value: 2550, word: "Nkoto mibale na nkama mitano na ntuku mitano", group: "2550-2559" },

    { value: 2560, word: "Nkoto mibale na nkama mitano na ntuku motoba", group: "2560-2569" },

    { value: 2570, word: "Nkoto mibale na nkama mitano na ntuku sambo", group: "2570-2579" },

    { value: 2580, word: "Nkoto mibale na nkama mitano na ntuku mwambe", group: "2580-2589" },

    { value: 2590, word: "Nkoto mibale na nkama mitano na ntuku libwa", group: "2590-2599" },

    { value: 2600, word: "Nkoto mibale na nkama motoba ", group: "2600-2609" },

    { value: 2610, word: "Nkoto mibale na nkama motoba na zomi", group: "2610-2619" },

    { value: 2620, word: "Nkoto mibale na nkama motoba na ntuku mibale", group: "2620-2629" },

    { value: 2630, word: "Nkoto mibale na nkama motoba na ntuku misato", group: "2630-2639" },

    { value: 2640, word: "Nkoto mibale na nkama motoba na ntuku minei", group: "2640-2649" },

    { value: 2650, word: "Nkoto mibale na nkama motoba na ntuku mitano", group: "2650-2659" },

    { value: 2660, word: "Nkoto mibale na nkama motoba na ntuku motoba", group: "2660-2669" },

    { value: 2670, word: "Nkoto mibale na nkama motoba na ntuku sambo", group: "2670-2679" },

    { value: 2680, word: "Nkoto mibale na nkama motoba na ntuku mwambe", group: "2680-2689" },

    { value: 2690, word: "Nkoto mibale na nkama motoba na ntuku libwa ", group: "2690-2699" },

    { value: 2700, word: "Nkoto mibale na nkama sambo", group: "2700-2709" },

    { value: 2710, word: "Nkoto mibale na nkama sambo na zomi", group: "2710-2719" },

    { value: 2720, word: "Nkoto mibale na nkama sambo na ntuku mibale", group: "2720-2729" },

    { value: 2730, word: "Nkoto mibale na nkama sambo na ntuku misato", group: "2730-2739" },

    { value: 2740, word: "Nkoto mibale na nkama sambo na ntuku minei", group: "2740-2749" },

    { value: 2750, word: "Nkoto mibale na nkama sambo na ntuku mitano", group: "2750-2759" },

    { value: 2760, word: "Nkoto mibale na nkama sambo na ntuku motoba", group: "2760-2769" },

    { value: 2770, word: "Nkoto mibale na nkama sambo na ntuku sambo", group: "2770-2779" },

    { value: 2780, word: "Nkoto mibale na nkama sambo na ntuku mwambe", group: "2780-2789" },

    { value: 2790, word: "Nkoto mibale na nkama sambo na ntuku libwa ", group: "2790-2799" },

    { value: 2800, word: "Nkoto mibale na nkama mwambe", group: "2800-2809" },

    { value: 2810, word: "Nkoto mibale na nkama mwambe na zomi", group: "2810-2819" },

    { value: 2820, word: "Nkoto mibale na nkama mwambe na ntuku mibale", group: "2820-2829" },

    { value: 2830, word: "Nkoto mibale na nkama mwambe na ntuku misato", group: "2830-2839" },

    { value: 2840, word: "Nkoto mibale na nkama mwambe na ntuku minei", group: "2840-2849" },

    { value: 2850, word: "Nkoto mibale na nkama mwambe na ntuku mitano", group: "2850-2859" },

    { value: 2860, word: "Nkoto mibale na nkama mwambe na ntuku motoba", group: "2860-2869" },

    { value: 2870, word: "Nkoto mibale na nkama mwambena ntuku sambo", group: "2870-2879" },

    { value: 2880, word: "Nkoto mibale na nkama mwambe na ntuku mwambe", group: "2880-2889" },

    { value: 2890, word: "Nkoto mibale na nkama mwambe na ntuku libwa ", group: "2890-2899" },

    { value: 2900, word: "Nkoto mibale na nkama libwa", group: "2900-2909" },

    { value: 2910, word: "Nkoto mibale na nkama libwa na ntuku zomi", group: "2910-2919" },

    { value: 2920, word: "Nkoto mibale na nkama libwa na ntuku mibale", group: "2920-2929" },

    { value: 2930, word: "Nkoto mibale na nkama libwa na ntuku misato", group: "2930-2939" },

    { value: 2940, word: "Nkoto mibale na nkama libwa na ntuku minei", group: "2940-2949" },

    { value: 2950, word: "Nkoto mibale na nkama libwa na ntuku mitano", group: "2950-2959" },

    { value: 2960, word: "Nkoto mibale na nkama libwa na ntuku motoba", group: "2960-2969" },

    { value: 2970, word: "Nkoto mibale na nkama libwa na ntuku sambo", group: "2970-2979" },

    { value: 2980, word: "Nkoto mibale na nkama libwa na ntuku mwambe", group: "2980-2989" },

    { value: 2990, word: "Nkoto mibale na nkama libwa na ntuku libwa ", group: "2990-2999" },

    { value: 3000, word: "Nkoto misato", group: "3000-3009" },
    { value: 3001, word: "Nkoto misato na moko", group: "3000-3009" },
    { value: 3002, word: "Nkoto misato na mibale", group: "3000-3009" },
    { value: 3003, word: "Nkoto misato na misato", group: "3000-3009" },
    { value: 3004, word: "Nkoto misato na minei", group: "3000-3009" },
    { value: 3005, word: "Nkoto misato na mitano", group: "3000-3009" },
    { value: 3006, word: "Nkoto misato na motoba", group: "3000-3009" },
    { value: 3007, word: "Nkoto misato na sambo", group: "3000-3009" },
    { value: 3008, word: "Nkoto misato na mwambe", group: "3000-3009" },
    { value: 3009, word: "Nkoto misato na libwa", group: "3000-3009" },

    { value: 3010, word: "Nkoto misato na zomi", group: "3010-3019" },
    { value: 3011, word: "Nkoto misato na zomi na moko", group: "3010-3019" },
    { value: 3012, word: "Nkoto misato na zomi na mibale", group: "3010-3019" },
    { value: 3013, word: "Nkoto misato na zomi na misato", group: "3010-3019" },
    { value: 3014, word: "Nkoto misato na zomi na minei", group: "3010-3019" },
    { value: 3015, word: "Nkoto misato na zomi na mitano", group: "3010-3019" },
    { value: 3016, word: "Nkoto misato na zomi na motoba", group: "3010-3019" },
    { value: 3017, word: "Nkoto misato na zomi na sambo", group: "3010-3019" },
    { value: 3018, word: "Nkoto misato na zomi na mwambe", group: "3010-3019" },
    { value: 3019, word: "Nkoto misato na zomi na libwa", group: "3010-3019" },

    { value: 3020, word: "Nkoto misato na ntuku mibale", group: "3020-3029" },
    { value: 3021, word: "Nkoto misato na ntuku mibale na moko", group: "3020-3029" },
    { value: 3022, word: "Nkoto misato na ntuku mibale na mibale", group: "3020-3029" },
    { value: 3023, word: "Nkoto misato na ntuku mibale na misato", group: "3020-3029" },
    { value: 3024, word: "Nkoto misato na ntuku mibale na minei", group: "3020-3029" },
    { value: 3025, word: "Nkoto misato na ntuku mibale na mitano", group: "3020-3029" },
    { value: 3026, word: "Nkoto misato na ntuku mibale na motoba", group: "3020-3029" },
    { value: 3027, word: "Nkoto misato na ntuku mibale na sambo", group: "3020-3029" },
    { value: 3028, word: "Nkoto misato na ntuku mibale na mwambe", group: "3020-3029" },
    { value: 3029, word: "Nkoto misato na ntuku mibale na libwa", group: "3020-3029" },

    { value: 3030, word: "Nkoto misato na ntuku misato", group: "3030-3039" },

    { value: 3040, word: "Nkoto misato na ntuku minei", group: "3040-3049" },

    { value: 3050, word: "Nkoto misato na ntuku mitano", group: "3050-3059" },

    { value: 3060, word: "Nkoto misato na ntuku motoba", group: "3060-3069" },
    
    { value: 3070, word: "Nkoto misato na ntuku sambo", group: "3070-3079" },

    { value: 3080, word: "Nkoto misato na ntuku mwambe", group: "3080-3089" },

    { value: 3090, word: "Nkoto misato na ntuku libwa", group: "3090-3099" },
    { value: 3091, word: "Nkoto misato na ntuku libwa na moko", group: "3090-3099" },
    { value: 3092, word: "Nkoto misato na ntuku libwa na mibale", group: "3090-3099" },
    { value: 3093, word: "Nkoto misato na ntuku libwa na misato", group: "3090-3099" },
    { value: 3094, word: "Nkoto misato na ntuku libwa na minei", group: "3090-3099" },
    { value: 3095, word: "Nkoto misato na ntuku libwa na mitano", group: "3090-3099" },
    { value: 3096, word: "Nkoto misato na ntuku libwa na motoba", group: "3090-3099" },
    { value: 3097, word: "Nkoto misato na ntuku libwa na sambo", group: "3090-3099" },
    { value: 3098, word: "Nkoto misato na ntuku libwa na mwambe", group: "3090-3099" },
    { value: 3099, word: "Nkoto misato na ntuku libwa na libwa", group: "3090-3099" },

    { value: 3100, word: "Nkoto misato na nkama", group: "3100-3109" },

    { value: 3110, word: "Nkoto misato na nkama na zomi", group: "3110-3119" },

    { value: 3120, word: "Nkoto misato na nkama na ntuku mibale", group: "3120-3129" },
    { value: 3121, word: "Nkoto misato na nkama na ntuku mibale na moko", group: "3121-3129" },
    { value: 3122, word: "Nkoto misato na nkama na ntuku mibale na mibale", group: "3121-3129" },
    { value: 3123, word: "Nkoto misato na nkama na ntuku mibale na misato", group: "3121-3129" },
    { value: 3124, word: "Nkoto misato na nkama na ntuku mibale na minei", group: "3121-3129" },
    { value: 3125, word: "Nkoto misato na nkama na ntuku mibale na mitano", group: "3121-3129" },
    { value: 3126, word: "Nkoto misato na nkama na ntuku mibale na motoba", group: "3121-3129" },
    { value: 3127, word: "Nkoto misato na nkama na ntuku mibale na sambo", group: "3121-3129" },
    { value: 3128, word: "Nkoto misato na nkama na ntuku mibale na mwambe", group: "3121-3129" },
    { value: 3129, word: "Nkoto misato na nkama na ntuku mibale na libwa", group: "3121-3129" },

    { value: 3130, word: "Nkoto misato na nkama na ntuku misato", group: "3130-3139" },

    { value: 3140, word: "Nkoto misato na nkama na ntuku minei", group: "3140-3149" },

    { value: 3150, word: "Nkoto misato na nkama na ntuku mitano", group: "3150-3159" },
    { value: 3151, word: "Nkoto misato na nkama na ntuku mitano na moko", group: "3151-3159" },
    { value: 3152, word: "Nkoto misato na nkama na ntuku mitano na mibale", group: "3151-3159" },
    { value: 3153, word: "Nkoto misato na nkama na ntuku mitano na misato", group: "3151-3159" },
    { value: 3154, word: "Nkoto misato na nkama na ntuku mitano na minei", group: "3151-3159" },
    { value: 3155, word: "Nkoto misato na nkama na ntuku mitano na mitano", group: "3151-3159" },
    { value: 3156, word: "Nkoto misato na nkama na ntuku mitano na motoba", group: "3151-3159" },
    { value: 3157, word: "Nkoto misato na nkama na ntuku mitano na sambo", group: "3151-3159" },
    { value: 3158, word: "Nkoto misato na nkama na ntuku mitano na mwambe", group: "3151-3159" },
    { value: 3159, word: "Nkoto misato na nkama na ntuku mitano na libwa", group: "3151-3159" },

    { value: 3160, word: "Nkoto misato na nkama na ntuku motoba", group: "3160-3169" },

    { value: 3170, word: "Nkoto misato na nkama na ntuku sambo", group: "3170-3179" },

    { value: 3180, word: "Nkoto misato na nkama na ntuku mwambe", group: "3180-3189" },
    { value: 3181, word: "Nkoto misato na nkama na ntuku mwambe na moko", group: "3181-3189" },
    { value: 3182, word: "Nkoto misato na nkama na ntuku mwambe na mibale", group: "3181-3189" },
    { value: 3183, word: "Nkoto misato na nkama na ntuku mwambe na misato", group: "3181-3189" },
    { value: 3184, word: "Nkoto misato na nkama na ntuku mwambe na minei", group: "3181-3189" },
    { value: 3185, word: "Nkoto misato na nkama na ntuku mwambe na mitano", group: "3181-3189" },
    { value: 3186, word: "Nkoto misato na nkama na ntuku mwambe na motoba", group: "3181-3189" },
    { value: 3187, word: "Nkoto misato na nkama na ntuku mwambe na sambo", group: "3181-3189" },
    { value: 3188, word: "Nkoto misato na nkama na ntuku mwambe na mwambe", group: "3181-3189" },
    { value: 3189, word: "Nkoto misato na nkama na ntuku mwambe na libwa", group: "3181-3189" },

    { value: 3190, word: "Nkoto misato na nkama na ntuku libwa", group: "3190-3199" },

    { value: 3200, word: "Nkoto misato na nkama mibale", group: "3200-3209" },

    { value: 3210, word: "Nkoto misato na nkama mibale na zomi", group: "3210-3219" },

    { value: 3220, word: "Nkoto misato na nkama mibale na ntuku mibale", group: "3220-3229" },

    { value: 3230, word: "Nkoto misato na nkama mibale na ntuku misato", group: "3230-3239" },

    { value: 3240, word: "Nkoto misato na nkama mibale na ntuku minei", group: "3240-3249" },

    { value: 3250, word: "Nkoto misato na nkama mibale na ntuku mitano", group: "3250-3259" },
    { value: 3251, word: "Nkoto misato na nkama mibale na ntuku mitano na moko", group: "3251-3259" },
    { value: 3252, word: "Nkoto misato na nkama mibale na ntuku mitano na mibale", group: "3251-3259" },
    { value: 3253, word: "Nkoto misato na nkama mibale na ntuku mitano na misato", group: "3251-3259" },
    { value: 3254, word: "Nkoto misato na nkama mibale na ntuku mitano na minei", group: "3251-3259" },
    { value: 3255, word: "Nkoto misato na nkama mibale na ntuku mitano na mitano", group: "3251-3259" },
    { value: 3256, word: "Nkoto misato na nkama mibale na ntuku mitano na motoba", group: "3251-3259" },
    { value: 3257, word: "Nkoto misato na nkama mibale na ntuku mitano na sambo", group: "3251-3259" },
    { value: 3258, word: "Nkoto misato na nkama mibale na ntuku mitano na mwambe", group: "3251-3259" },
    { value: 3259, word: "Nkoto misato na nkama mibale na ntuku mitano na libwa", group: "3251-3259" },

    { value: 3260, word: "Nkoto misato na nkama mibale na ntuku motoba", group: "3260-3269" },

    { value: 3270, word: "Nkoto misato na nkama mibale na ntuku sambo", group: "3270-3279" },

    { value: 3280, word: "Nkoto misato na nkama mibale na ntuku mwambe", group: "3280-3289" },

    { value: 3290, word: "Nkoto misato na nkama mibale na ntuku libwa", group: "3290-3299" },

    { value: 3300, word: "Nkoto misato na nkama misato", group: "3300-3409" },
    { value: 3301, word: "Nkoto misato na nkama misato na moko", group: "3300-3409" },
    { value: 3302, word: "Nkoto misato na nkama misato na mibale", group: "3300-3409" },
    { value: 3303, word: "Nkoto misato na nkama misato na misato", group: "3300-3409" },
    { value: 3304, word: "Nkoto misato na nkama misato na minei", group: "3300-3409" },
    { value: 3305, word: "Nkoto misato na nkama misato na mitano", group: "3300-3409" },
    { value: 3306, word: "Nkoto misato na nkama misato na motoba", group: "3300-3409" },
    { value: 3307, word: "Nkoto misato na nkama misato na sambo", group: "3300-3409" },
    { value: 3308, word: "Nkoto misato na nkama misato na mwambe", group: "3300-3409" },
    { value: 3309, word: "Nkoto misato na nkama misato na libwa", group: "3300-3409" },

    { value: 3310, word: "Nkoto misato na nkama misato na zomi", group: "3310-3319" },

    { value: 3320, word: "Nkoto misato na nkama misato na ntuku mibale", group: "3320-3329" },

    { value: 3330, word: "Nkoto misato na nkama misato na ntuku misato", group: "3330-3339" },

    { value: 3340, word: "Nkoto misato na nkama misato na ntuku minei", group: "3340-3349" },

    { value: 3350, word: "Nkoto misato na nkama misato na ntuku mitano", group: "3350-3359" },

    { value: 3360, word: "Nkoto misato na nkama misato na ntuku motoba", group: "3360-3369" },

    { value: 3370, word: "Nkoto misato na nkama misato na ntuku sambo", group: "3370-3379" },

    { value: 3380, word: "Nkoto misato na nkama misato na ntuku mwambe", group: "3380-3389" },

    { value: 3390, word: "Nkoto misato na nkama misato na ntuku libwa", group: "3390-3399" },

    { value: 3400, word: "Nkoto misato na nkama minei", group: "3400-3409" },
    { value: 3401, word: "Nkoto misato na nkama minei na moko", group: "3400-3409" },
    { value: 3402, word: "Nkoto misato na nkama minei na mibale", group: "3400-3409" },
    { value: 3403, word: "Nkoto misato na nkama minei na misato", group: "3400-3409" },
    { value: 3404, word: "Nkoto misato na nkama minei na minei", group: "3400-3409" },
    { value: 3405, word: "Nkoto misato na nkama minei na mitano", group: "3400-3409" },
    { value: 3406, word: "Nkoto misato na nkama minei na motoba", group: "3400-3409" },
    { value: 3407, word: "Nkoto misato na nkama minei na sambo", group: "3400-3409" },
    { value: 3408, word: "Nkoto misato na nkama minei na mwambe", group: "3400-3409" },
    { value: 3409, word: "Nkoto misato na nkama minei na libwa", group: "3400-3409" },

    { value: 3410, word: "Nkoto misato na nkama minei na zomi", group: "3410-3419" },

    { value: 3420, word: "Nkoto misato na nkama minei na ntuku mibale", group: "3420-3429" },

    { value: 3430, word: "Nkoto misato na nkama minei na ntuku misato", group: "3430-3439" },

    { value: 3440, word: "Nkoto misato na nkama minei na ntuku minei", group: "3440-3449" },

    { value: 3450, word: "Nkoto misato na nkama minei na ntuku mitano", group: "3450-3459" },

    { value: 3460, word: "Nkoto misato na nkama minei na ntuku motoba", group: "3460-3469" },

    { value: 3470, word: "Nkoto misato na nkama minei na ntuku sambo", group: "3470-3479" },

    { value: 3480, word: "Nkoto misato na nkama minei na ntuku mwambe", group: "3480-3489" },

    { value: 3490, word: "Nkoto misato na nkama minei na ntuku libwa", group: "3490-3499" },

    { value: 3500, word: "Nkoto misato na nkama mitano", group: "3500-3509" },

    { value: 3510, word: "Nkoto misato na nkama mitano na zomi", group: "3510-3519" },

    { value: 3520, word: "Nkoto misato na nkama mitano na ntuku mibale", group: "3520-3529" },

    { value: 3530, word: "Nkoto misato na nkama mitano na ntuku misato", group: "3530-3539" },

    { value: 3540, word: "Nkoto misato na nkama mitano na ntuku minei", group: "3540-3549" },

    { value: 3550, word: "Nkoto misato na nkama mitano na ntuku mitano", group: "3550-3559" },

    { value: 3560, word: "Nkoto misato na nkama mitano na ntuku motoba", group: "3560-3569" },

    { value: 3570, word: "Nkoto misato na nkama mitano na ntuku sambo", group: "3570-3579" },

    { value: 3580, word: "Nkoto misato na nkama mitano na ntuku mwambe", group: "3580-3589" },

    { value: 3590, word: "Nkoto misato na nkama mitano na ntuku libwa", group: "3590-3599" },

    { value: 3600, word: "Nkoto misato na nkama motoba", group: "3600-3609" },

    { value: 3610, word: "Nkoto misato na nkama motoba na zomi", group: "3610-3619" },

    { value: 3620, word: "Nkoto misato na nkama motoba na ntuku mibale", group: "3620-3629" },

    // Extend further as needed
    { value: 4000, word: "Nkoto minei", group: "4000-4009" },

    { value: 4010, word: "Nkoto minei na zomi", group: "4010-4019" },

    { value: 4020, word: "Nkoto minei na ntuku mibale", group: "4020-4029" },

    { value: 4030, word: "Nkoto minei na ntuku misato", group: "4030-4039" },

    { value: 4040, word: "Nkoto minei na ntuku minei", group: "4040-4049" },

    { value: 4050, word: "Nkoto minei na ntuku mitano", group: "4050-4059" },

    { value: 4060, word: "Nkoto minei na ntuku motoba", group: "4060-4069" },

    { value: 4070, word: "Nkoto minei na ntuku sambo", group: "4070-4079" },

    { value: 4080, word: "Nkoto minei na ntuku mwambe", group: "4080-4089" },

    { value: 4090, word: "Nkoto minei na ntuku libwa", group: "4090-4099" },
    { value: 4091, word: "Nkoto minei na ntuku libwa na moko", group: "4090-4099" },
    { value: 4092, word: "Nkoto minei na ntuku libwa na mibale", group: "4090-4099" },
    { value: 4093, word: "Nkoto minei na ntuku libwa na misato", group: "4090-4099" },
    { value: 4094, word: "Nkoto minei na ntuku libwa na minei", group: "4090-4099" },
    { value: 4095, word: "Nkoto minei na ntuku libwa na mitano", group: "4090-4099" },
    { value: 4096, word: "Nkoto minei na ntuku libwa na motoba", group: "4090-4099" },
    { value: 4097, word: "Nkoto minei na ntuku libwa na sambo", group: "4090-4099" },
    { value: 4098, word: "Nkoto minei na ntuku libwa na mwambe", group: "4090-4099" },
    { value: 4099, word: "Nkoto minei na ntuku libwa na libwa", group: "4090-4099" },

    { value: 4100, word: "Nkoto mitano", group: "4100-4109" },

    { value: 4110, word: "Nkoto mitano na zomi", group: "4110-4119" },

    { value: 4120, word: "Nkoto mitano na ntuku mibale", group: "4120-4129" },

    { value: 4130, word: "Nkoto mitano na ntuku misato", group: "4130-4139" },

    { value: 4140, word: "Nkoto mitano na ntuku minei", group: "4140-4149" },

    { value: 4150, word: "Nkoto mitano na ntuku mitano", group: "4150-4159" },

    { value: 4160, word: "Nkoto mitano na ntuku motoba", group: "4160-4169" },

    { value: 4170, word: "Nkoto mitano na ntuku sambo", group: "4170-4179" },

    { value: 4180, word: "Nkoto mitano na ntuku mwambe", group: "4180-4189" },

    { value: 4190, word: "Nkoto mitano na ntuku libwa", group: "4190-4199" },

    { value: 4200, word: "Nkoto mitano na zomi", group: "4200-4209" },

    { value: 4210, word: "Nkoto mitano na zomi na moko", group: "4210-4219" },

    { value: 4220, word: "Nkoto mitano na zomi na mibale", group: "4220-4229" },

    { value: 4230, word: "Nkoto mitano na zomi na misato", group: "4230-4239" },

    { value: 4240, word: "Nkoto mitano na zomi na minei", group: "4240-4249" },

    { value: 4250, word: "Nkoto mitano na zomi na mitano", group: "4250-4259" },

    { value: 4260, word: "Nkoto mitano na zomi na motoba", group: "4260-4269" },

    { value: 4270, word: "Nkoto mitano na zomi na sambo", group: "4270-4279" },

    { value: 4280, word: "Nkoto mitano na zomi na mwambe", group: "4280-4289" },

    { value: 4290, word: "Nkoto mitano na zomi na libwa", group: "4290-4299" },

    { value: 4300, word: "Nkoto mitano na ntuku mibale", group: "4300-4309" },

    { value: 4310, word: "Nkoto mitano na ntuku mibale na moko", group: "4310-4319" },

    { value: 4320, word: "Nkoto mitano na ntuku mibale na mibale", group: "4320-4329" },

    { value: 4330, word: "Nkoto mitano na ntuku mibale na misato", group: "4330-4339" },

    { value: 4340, word: "Nkoto mitano na ntuku mibale na minei", group: "4340-4349" },

    { value: 4350, word: "Nkoto mitano na ntuku mibale na mitano", group: "4350-4359" },

    { value: 4360, word: "Nkoto mitano na ntuku mibale na motoba", group: "4360-4369" },

    { value: 4370, word: "Nkoto mitano na ntuku mibale na sambo", group: "4370-4379" },

    { value: 4380, word: "Nkoto mitano na ntuku mibale na mwambe", group: "4380-4389" },

    { value: 4390, word: "Nkoto mitano na ntuku mibale na libwa", group: "4390-4399" },

    { value: 4400, word: "Nkoto mitano na ntuku misato", group: "4400-4409" },

    { value: 4410, word: "Nkoto mitano na ntuku misato na moko", group: "4410-4419" },

    { value: 4420, word: "Nkoto mitano na ntuku misato na mibale", group: "4420-4429" },

    { value: 4430, word: "Nkoto mitano na ntuku misato na misato", group: "4430-4439" },

    { value: 4440, word: "Nkoto mitano na ntuku misato na minei", group: "4440-4449" },

    { value: 4450, word: "Nkoto mitano na ntuku misato na mitano", group: "4450-4459" },

    { value: 4460, word: "Nkoto mitano na ntuku misato na motoba", group: "4460-4469" },

    { value: 4470, word: "Nkoto mitano na ntuku misato na sambo", group: "4470-4479" },

    { value: 4480, word: "Nkoto mitano na ntuku misato na mwambe", group: "4480-4489" },

    { value: 4490, word: "Nkoto mitano na ntuku misato na libwa", group: "4490-4499" },

    { value: 4500, word: "Nkoto mitano na ntuku minei", group: "4500-4509" },

    { value: 4510, word: "Nkoto mitano na ntuku minei na moko", group: "4510-4519" },

    { value: 4520, word: "Nkoto mitano na ntuku minei na mibale", group: "4520-4529" },

    { value: 4530, word: "Nkoto mitano na ntuku minei na misato", group: "4530-4539" },

    { value: 4540, word: "Nkoto mitano na ntuku minei na minei", group: "4540-4549" },

    { value: 4550, word: "Nkoto mitano na ntuku minei na mitano", group: "4550-4559" },

    { value: 4560, word: "Nkoto mitano na ntuku minei na motoba", group: "4560-4569" },

    { value: 4570, word: "Nkoto mitano na ntuku minei na sambo", group: "4570-4579" },

    { value: 4580, word: "Nkoto mitano na ntuku minei na mwambe", group: "4580-4589" },

    { value: 4590, word: "Nkoto mitano na ntuku minei na libwa", group: "4590-4599" },

    { value: 4600, word: "Nkoto mitano na ntuku mitano", group: "4600-4609" },

    { value: 4610, word: "Nkoto mitano na ntuku mitano na moko", group: "4610-4619" },

    { value: 4620, word: "Nkoto mitano na ntuku mitano na mibale", group: "4620-4629" },

    { value: 4630, word: "Nkoto mitano na ntuku mitano na misato", group: "4630-4639" },

    { value: 4640, word: "Nkoto mitano na ntuku mitano na minei", group: "4640-4649" },

    { value: 4650, word: "Nkoto mitano na ntuku mitano na mitano", group: "4650-4659" },

    { value: 4660, word: "Nkoto mitano na ntuku mitano na motoba", group: "4660-4669" },

    { value: 4670, word: "Nkoto mitano na ntuku mitano na sambo", group: "4670-4679" },

    { value: 4680, word: "Nkoto mitano na ntuku mitano na mwambe", group: "4680-4689" },

    { value: 4690, word: "Nkoto mitano na ntuku mitano na libwa", group: "4690-4699" },

    { value: 4700, word: "Nkoto mitano na ntuku motoba", group: "4700-4709" },

    { value: 4710, word: "Nkoto mitano na ntuku motoba na moko", group: "4710-4719" },

    { value: 4720, word: "Nkoto mitano na ntuku motoba na mibale", group: "4720-4729" },

    { value: 4730, word: "Nkoto mitano na ntuku motoba na misato", group: "4730-4739" },

    { value: 4740, word: "Nkoto mitano na ntuku motoba na minei", group: "4740-4749" },

    { value: 4750, word: "Nkoto mitano na ntuku motoba na mitano", group: "4750-4759" },

    { value: 4760, word: "Nkoto mitano na ntuku motoba na motoba", group: "4760-4769" },

    { value: 4770, word: "Nkoto mitano na ntuku motoba na sambo", group: "4770-4779" },

    { value: 4780, word: "Nkoto mitano na ntuku motoba na mwambe", group: "4780-4789" },

    { value: 4790, word: "Nkoto mitano na ntuku motoba na libwa", group: "4790-4799" },

    { value: 4800, word: "Nkoto mitano na ntuku sambo", group: "4800-4809" },

    { value: 4810, word: "Nkoto mitano na ntuku sambo na moko", group: "4810-4819" },

    { value: 4820, word: "Nkoto mitano na ntuku sambo na mibale", group: "4820-4829" },

    { value: 4830, word: "Nkoto mitano na ntuku sambo na misato", group: "4830-4839" },

    { value: 4840, word: "Nkoto mitano na ntuku sambo na minei", group: "4840-4849" },

    { value: 4850, word: "Nkoto mitano na ntuku sambo na mitano", group: "4850-4859" },

    { value: 4860, word: "Nkoto mitano na ntuku sambo na motoba", group: "4860-4869" },

    { value: 4870, word: "Nkoto mitano na ntuku sambo na sambo", group: "4870-4879" },

    { value: 4880, word: "Nkoto mitano na ntuku sambo na mwambe", group: "4880-4889" },

    { value: 4890, word: "Nkoto mitano na ntuku sambo na libwa", group: "4890-4899" },

    { value: 4900, word: "Nkoto mitano na ntuku mwambe", group: "4900-4909" },

    { value: 4910, word: "Nkoto mitano na ntuku mwambe na moko", group: "4910-4919" },

    { value: 4920, word: "Nkoto mitano na ntuku mwambe na mibale", group: "4920-4929" },

    { value: 4930, word: "Nkoto mitano na ntuku mwambe na misato", group: "4930-4939" },

    { value: 4940, word: "Nkoto mitano na ntuku mwambe na minei", group: "4940-4949" },

    { value: 4950, word: "Nkoto mitano na ntuku mwambe na mitano", group: "4950-4959" },

    { value: 4960, word: "Nkoto mitano na ntuku mwambe na motoba", group: "4960-4969" },

    { value: 4970, word: "Nkoto mitano na ntuku mwambe na sambo", group: "4970-4979" },

    { value: 4980, word: "Nkoto mitano na ntuku mwambe na mwambe", group: "4980-4989" },

    { value: 4990, word: "Nkoto mitano na ntuku mwambe na libwa", group: "4990-4999" },

    // Extend further as needed
    { value: 5000, word: "Nkoto mitano", group: "5000-5009" },
    { value: 5001, word: "Nkoto mitano na moko", group: "5000-5009" },
    { value: 5002, word: "Nkoto mitano na mibale", group: "5000-5009" },
    { value: 5003, word: "Nkoto mitano na misato", group: "5000-5009" },
    { value: 5004, word: "Nkoto mitano na minei", group: "5000-5009" },
    { value: 5005, word: "Nkoto mitano na mitano", group: "5000-5009" },
    { value: 5006, word: "Nkoto mitano na motoba", group: "5000-5009" },
    { value: 5007, word: "Nkoto mitano na sambo", group: "5000-5009" },
    { value: 5008, word: "Nkoto mitano na mwambe", group: "5000-5009" },
    { value: 5009, word: "Nkoto mitano na libwa", group: "5000-5009" },

    { value: 5010, word: "Nkoto mitano na zomi", group: "5010-5019" },
    { value: 5011, word: "Nkoto mitano na zomi na moko", group: "5010-5019" },
    { value: 5012, word: "Nkoto mitano na zomi na mibale", group: "5010-5019" },
    { value: 5013, word: "Nkoto mitano na zomi na misato", group: "5010-5019" },
    { value: 5014, word: "Nkoto mitano na zomi na minei", group: "5010-5019" },
    { value: 5015, word: "Nkoto mitano na zomi na mitano", group: "5010-5019" },
    { value: 5016, word: "Nkoto mitano na zomi na motoba", group: "5010-5019" },
    { value: 5017, word: "Nkoto mitano na zomi na sambo", group: "5010-5019" },
    { value: 5018, word: "Nkoto mitano na zomi na mwambe", group: "5010-5019" },
    { value: 5019, word: "Nkoto mitano na zomi na libwa", group: "5010-5019" },

    { value: 5020, word: "Nkoto mitano na ntuku mibale", group: "5020-5029" },
    { value: 5021, word: "Nkoto mitano na ntuku mibale na moko", group: "5020-5029" },
    { value: 5022, word: "Nkoto mitano na ntuku mibale na mibale", group: "5020-5029" },
    { value: 5023, word: "Nkoto mitano na ntuku mibale na misato", group: "5020-5029" },
    { value: 5024, word: "Nkoto mitano na ntuku mibale na minei", group: "5020-5029" },
    { value: 5025, word: "Nkoto mitano na ntuku mibale na mitano", group: "5020-5029" },
    { value: 5026, word: "Nkoto mitano na ntuku mibale na motoba", group: "5020-5029" },
    { value: 5027, word: "Nkoto mitano na ntuku mibale na sambo", group: "5020-5029" },
    { value: 5028, word: "Nkoto mitano na ntuku mibale na mwambe", group: "5020-5029" },
    { value: 5029, word: "Nkoto mitano na ntuku mibale na libwa", group: "5020-5029" },

    { value: 5030, word: "Nkoto mitano na ntuku misato", group: "5030-5039" },
    { value: 5031, word: "Nkoto mitano na ntuku misato na moko", group: "5030-5039" },
    { value: 5032, word: "Nkoto mitano na ntuku misato na mibale", group: "5030-5039" },
    { value: 5033, word: "Nkoto mitano na ntuku misato na misato", group: "5030-5039" },
    { value: 5034, word: "Nkoto mitano na ntuku misato na minei", group: "5030-5039" },
    { value: 5035, word: "Nkoto mitano na ntuku misato na mitano", group: "5030-5039" },
    { value: 5036, word: "Nkoto mitano na ntuku misato na motoba", group: "5030-5039" },
    { value: 5037, word: "Nkoto mitano na ntuku misato na sambo", group: "5030-5039" },
    { value: 5038, word: "Nkoto mitano na ntuku misato na mwambe", group: "5030-5039" },
    { value: 5039, word: "Nkoto mitano na ntuku misato na libwa", group: "5030-5039" },

    { value: 5040, word: "Nkoto mitano na ntuku minei", group: "5040-5049" },
    { value: 5041, word: "Nkoto mitano na ntuku minei na moko", group: "5040-5049" },
    { value: 5042, word: "Nkoto mitano na ntuku minei na mibale", group: "5040-5049" },
    { value: 5043, word: "Nkoto mitano na ntuku minei na misato", group: "5040-5049" },
    { value: 5044, word: "Nkoto mitano na ntuku minei na minei", group: "5040-5049" },
    { value: 5045, word: "Nkoto mitano na ntuku minei na mitano", group: "5040-5049" },
    { value: 5046, word: "Nkoto mitano na ntuku minei na motoba", group: "5040-5049" },
    { value: 5047, word: "Nkoto mitano na ntuku minei na sambo", group: "5040-5049" },
    { value: 5048, word: "Nkoto mitano na ntuku minei na mwambe", group: "5040-5049" },
    { value: 5049, word: "Nkoto mitano na ntuku minei na libwa", group: "5040-5049" },

    { value: 5050, word: "Nkoto mitano na ntuku mitano", group: "5050-5059" },
    { value: 5051, word: "Nkoto mitano na ntuku mitano na moko", group: "5050-5059" },
    { value: 5052, word: "Nkoto mitano na ntuku mitano na mibale", group: "5050-5059" },
    { value: 5053, word: "Nkoto mitano na ntuku mitano na misato", group: "5050-5059" },
    { value: 5054, word: "Nkoto mitano na ntuku mitano na minei", group: "5050-5059" },
    { value: 5055, word: "Nkoto mitano na ntuku mitano na mitano", group: "5050-5059" },
    { value: 5056, word: "Nkoto mitano na ntuku mitano na motoba", group: "5050-5059" },
    { value: 5057, word: "Nkoto mitano na ntuku mitano na sambo", group: "5050-5059" },
    { value: 5058, word: "Nkoto mitano na ntuku mitano na mwambe", group: "5050-5059" },
    { value: 5059, word: "Nkoto mitano na ntuku mitano na libwa", group: "5050-5059" },

    { value: 5060, word: "Nkoto mitano na ntuku motoba", group: "5060-5069" },
    { value: 5061, word: "Nkoto mitano na ntuku motoba na moko", group: "5060-5069" },
    { value: 5062, word: "Nkoto mitano na ntuku motoba na mibale", group: "5060-5069" },
    { value: 5063, word: "Nkoto mitano na ntuku motoba na misato", group: "5060-5069" },
    { value: 5064, word: "Nkoto mitano na ntuku motoba na minei", group: "5060-5069" },
    { value: 5065, word: "Nkoto mitano na ntuku motoba na mitano", group: "5060-5069" },
    { value: 5066, word: "Nkoto mitano na ntuku motoba na motoba", group: "5060-5069" },
    { value: 5067, word: "Nkoto mitano na ntuku motoba na sambo", group: "5060-5069" },
    { value: 5068, word: "Nkoto mitano na ntuku motoba na mwambe", group: "5060-5069" },
    { value: 5069, word: "Nkoto mitano na ntuku motoba na libwa", group: "5060-5069" },

    { value: 5070, word: "Nkoto mitano na ntuku sambo", group: "5070-5079" },
    { value: 5071, word: "Nkoto mitano na ntuku sambo na moko", group: "5070-5079" },
    { value: 5072, word: "Nkoto mitano na ntuku sambo na mibale", group: "5070-5079" },
    { value: 5073, word: "Nkoto mitano na ntuku sambo na misato", group: "5070-5079" },
    { value: 5074, word: "Nkoto mitano na ntuku sambo na minei", group: "5070-5079" },
    { value: 5075, word: "Nkoto mitano na ntuku sambo na mitano", group: "5070-5079" },
    { value: 5076, word: "Nkoto mitano na ntuku sambo na motoba", group: "5070-5079" },
    { value: 5077, word: "Nkoto mitano na ntuku sambo na sambo", group: "5070-5079" },
    { value: 5078, word: "Nkoto mitano na ntuku sambo na mwambe", group: "5070-5079" },
    { value: 5079, word: "Nkoto mitano na ntuku sambo na libwa", group: "5070-5079" },

    { value: 5080, word: "Nkoto mitano na ntuku mwambe", group: "5080-5089" },
    { value: 5081, word: "Nkoto mitano na ntuku mwambe na moko", group: "5080-5089" },
    { value: 5082, word: "Nkoto mitano na ntuku mwambe na mibale", group: "5080-5089" },
    { value: 5083, word: "Nkoto mitano na ntuku mwambe na misato", group: "5080-5089" },
    { value: 5084, word: "Nkoto mitano na ntuku mwambe na minei", group: "5080-5089" },
    { value: 5085, word: "Nkoto mitano na ntuku mwambe na mitano", group: "5080-5089" },
    { value: 5086, word: "Nkoto mitano na ntuku mwambe na motoba", group: "5080-5089" },
    { value: 5087, word: "Nkoto mitano na ntuku mwambe na sambo", group: "5080-5089" },
    { value: 5088, word: "Nkoto mitano na ntuku mwambe na mwambe", group: "5080-5089" },
    { value: 5089, word: "Nkoto mitano na ntuku mwambe na libwa", group: "5080-5089" },
    
    { value: 5090, word: "Nkoto mitano na ntuku libwa", group: "5090-5099" },
    { value: 5091, word: "Nkoto mitano na ntuku libwa na moko", group: "5090-5099" },
    { value: 5092, word: "Nkoto mitano na ntuku libwa na mibale", group: "5090-5099" },
    { value: 5093, word: "Nkoto mitano na ntuku libwa na misato", group: "5090-5099" },
    { value: 5094, word: "Nkoto mitano na ntuku libwa na minei", group: "5090-5099" },
    { value: 5095, word: "Nkoto mitano na ntuku libwa na mitano", group: "5090-5099" },
    { value: 5096, word: "Nkoto mitano na ntuku libwa na motoba", group: "5090-5099" },
    { value: 5097, word: "Nkoto mitano na ntuku libwa na sambo", group: "5090-5099" },
    { value: 5098, word: "Nkoto mitano na ntuku libwa na mwambe", group: "5090-5099" },
    { value: 5099, word: "Nkoto mitano na ntuku libwa na libwa", group: "5090-5099" },

    { value: 5100, word: "Nkoto mitano na nkama", group: "5100-5109" },
    { value: 5101, word: "Nkoto mitano na nkama na moko", group: "5100-5109" },
    { value: 5102, word: "Nkoto mitano na nkama na mibale", group: "5100-5109" },
    { value: 5103, word: "Nkoto mitano na nkama na misato", group: "5100-5109" },
    { value: 5104, word: "Nkoto mitano na nkama na minei", group: "5100-5109" },
    { value: 5105, word: "Nkoto mitano na nkama na mitano", group: "5100-5109" },
    { value: 5106, word: "Nkoto mitano na nkama na motoba", group: "5100-5109" },
    { value: 5107, word: "Nkoto mitano na nkama na sambo", group: "5100-5109" },
    { value: 5108, word: "Nkoto mitano na nkama na mwambe", group: "5100-5109" },
    { value: 5109, word: "Nkoto mitano na nkama na libwa", group: "5100-5109" },

    { value: 5110, word: "Nkoto mitano na nkama na zomi", group: "5110-5119" },
    { value: 5111, word: "Nkoto mitano na nkama na zomi na moko", group: "5110-5119" },
    { value: 5112, word: "Nkoto mitano na nkama na zomi na mibale", group: "5110-5119" },
    { value: 5113, word: "Nkoto mitano na nkama na zomi na misato", group: "5110-5119" },
    { value: 5114, word: "Nkoto mitano na nkama na zomi na minei", group: "5110-5119" },
    { value: 5115, word: "Nkoto mitano na nkama na zomi na mitano", group: "5110-5119" },
    { value: 5116, word: "Nkoto mitano na nkama na zomi na motoba", group: "5110-5119" },
    { value: 5117, word: "Nkoto mitano na nkama na zomi na sambo", group: "5110-5119" },
    { value: 5118, word: "Nkoto mitano na nkama na zomi na mwambe", group: "5110-5119" },
    { value: 5119, word: "Nkoto mitano na nkama na zomi na libwa", group: "5110-5119" },

    { value: 5120, word: "Nkoto mitano na nkama na ntuku mibale", group: "5120-5129" },

    { value: 5130, word: "Nkoto mitano na nkama na ntuku misato", group: "5130-5139" },

    { value: 5140, word: "Nkoto mitano na nkama na ntuku minei", group: "5140-5149" },

    { value: 5150, word: "Nkoto mitano na nkama na ntuku mitano", group: "5150-5159" },

    { value: 5160, word: "Nkoto mitano na nkama na ntuku motoba", group: "5160-5169" },

    { value: 5170, word: "Nkoto mitano na nkama na ntuku sambo", group: "5170-5179" },

    { value: 5180, word: "Nkoto mitano na nkama na ntuku mwambe", group: "5180-5189" },

    { value: 5190, word: "Nkoto mitano na nkama na ntuku libwa", group: "5190-5199" },

    { value: 5200, word: "Nkoto mitano na nkama mibale", group: "5200-5209" },

    { value: 5210, word: "Nkoto mitano na nkama mibale na zomi", group: "5210-5219" },

    { value: 5220, word: "Nkoto mitano na nkama mibale na ntuku mibale", group: "5220-5229" },

    { value: 5230, word: "Nkoto mitano na nkama mibale na ntuku misato", group: "5230-5239" },

    { value: 5240, word: "Nkoto mitano na nkama mibale na ntuku minei", group: "5240-5249" },

    { value: 5250, word: "Nkoto mitano na nkama mibale na ntuku mitano", group: "5250-5259" },

    { value: 5260, word: "Nkoto mitano na nkama mibale na ntuku motoba", group: "5260-5269" },

    { value: 5270, word: "Nkoto mitano na nkama mibale na ntuku sambo", group: "5270-5279" },

    { value: 5280, word: "Nkoto mitano na nkama mibale na ntuku mwambe", group: "5280-5289" },

    { value: 5290, word: "Nkoto mitano na nkama mibale na ntuku libwa", group: "5290-5299" },

    { value: 5300, word: "Nkoto mitano na nkama misato", group: "5300-5309" },

    { value: 5310, word: "Nkoto mitano na nkama misato na zomi", group: "5310-5319" },

    { value: 5320, word: "Nkoto mitano na nkama misato na ntuku mibale", group: "5320-5329" },

    { value: 5330, word: "Nkoto mitano na nkama misato na ntuku misato", group: "5330-5339" },

    { value: 5340, word: "Nkoto mitano na nkama misato na ntuku minei", group: "5340-5349" },

    { value: 5350, word: "Nkoto mitano na nkama misato na ntuku mitano", group: "5350-5359" },

    { value: 5360, word: "Nkoto mitano na nkama misato na ntuku motoba", group: "5360-5369" },

    { value: 5370, word: "Nkoto mitano na nkama misato na ntuku sambo", group: "5370-5379" },

    // Extend further as needed
    { value: 6000, word: "Nkoto motoba", group: "6000-6009" },
    { value: 6001, word: "Nkoto motoba na moko", group: "6000-6009" },
    { value: 6002, word: "Nkoto motoba na mibale", group: "6000-6009" },
    { value: 6003, word: "Nkoto motoba na misato", group: "6000-6009" },
    { value: 6004, word: "Nkoto motoba na minei", group: "6000-6009" },
    { value: 6005, word: "Nkoto motoba na mitano", group: "6000-6009" },
    { value: 6006, word: "Nkoto motoba na motoba", group: "6000-6009" },
    { value: 6007, word: "Nkoto motoba na sambo", group: "6000-6009" },
    { value: 6008, word: "Nkoto motoba na mwambe", group: "6000-6009" },
    { value: 6009, word: "Nkoto motoba na libwa", group: "6000-6009" },

    { value: 6010, word: "Nkoto motoba na zomi", group: "6010-6019" },
    { value: 6011, word: "Nkoto motoba na zomi na moko", group: "6010-6019" },
    { value: 6012, word: "Nkoto motoba na zomi na mibale", group: "6010-6019" },
    { value: 6013, word: "Nkoto motoba na zomi na misato", group: "6010-6019" },
    { value: 6014, word: "Nkoto motoba na zomi na minei", group: "6010-6019" },
    { value: 6015, word: "Nkoto motoba na zomi na mitano", group: "6010-6019" },
    { value: 6016, word: "Nkoto motoba na zomi na motoba", group: "6010-6019" },
    { value: 6017, word: "Nkoto motoba na zomi na sambo", group: "6010-6019" },
    { value: 6018, word: "Nkoto motoba na zomi na mwambe", group: "6010-6019" },
    { value: 6019, word: "Nkoto motoba na zomi na libwa", group: "6010-6019" },

    { value: 6020, word: "Nkoto motoba na ntuku mibale", group: "6020-6029" },
    { value: 6021, word: "Nkoto motoba na ntuku mibale na moko", group: "6020-6029" },
    { value: 6022, word: "Nkoto motoba na ntuku mibale na mibale", group: "6020-6029" },
    { value: 6023, word: "Nkoto motoba na ntuku mibale na misato", group: "6020-6029" },
    { value: 6024, word: "Nkoto motoba na ntuku mibale na minei", group: "6020-6029" },
    { value: 6025, word: "Nkoto motoba na ntuku mibale na mitano", group: "6020-6029" },
    { value: 6026, word: "Nkoto motoba na ntuku mibale na motoba", group: "6020-6029" },
    { value: 6027, word: "Nkoto motoba na ntuku mibale na sambo", group: "6020-6029" },
    { value: 6028, word: "Nkoto motoba na ntuku mibale na mwambe", group: "6020-6029" },
    { value: 6029, word: "Nkoto motoba na ntuku mibale na libwa", group: "6020-6029" },

    { value: 6030, word: "Nkoto motoba na ntuku misato", group: "6030-6039" },
    { value: 6031, word: "Nkoto motoba na ntuku misato na moko", group: "6030-6039" },
    { value: 6032, word: "Nkoto motoba na ntuku misato na mibale", group: "6030-6039" },
    { value: 6033, word: "Nkoto motoba na ntuku misato na misato", group: "6030-6039" },
    { value: 6034, word: "Nkoto motoba na ntuku misato na minei", group: "6030-6039" },
    { value: 6035, word: "Nkoto motoba na ntuku misato na mitano", group: "6030-6039" },
    { value: 6036, word: "Nkoto motoba na ntuku misato na motoba", group: "6030-6039" },
    { value: 6037, word: "Nkoto motoba na ntuku misato na sambo", group: "6030-6039" },
    { value: 6038, word: "Nkoto motoba na ntuku misato na mwambe", group: "6030-6039" },
    { value: 6039, word: "Nkoto motoba na ntuku misato na libwa", group: "6030-6039" },

    { value: 6040, word: "Nkoto motoba na ntuku minei", group: "6040-6049" },
    { value: 6041, word: "Nkoto motoba na ntuku minei na moko", group: "6040-6049" },
    { value: 6042, word: "Nkoto motoba na ntuku minei na mibale", group: "6040-6049" },
    { value: 6043, word: "Nkoto motoba na ntuku minei na misato", group: "6040-6049" },
    { value: 6044, word: "Nkoto motoba na ntuku minei na minei", group: "6040-6049" },
    { value: 6045, word: "Nkoto motoba na ntuku minei na mitano", group: "6040-6049" },
    { value: 6046, word: "Nkoto motoba na ntuku minei na motoba", group: "6040-6049" },
    { value: 6047, word: "Nkoto motoba na ntuku minei na sambo", group: "6040-6049" },
    { value: 6048, word: "Nkoto motoba na ntuku minei na mwambe", group: "6040-6049" },
    { value: 6049, word: "Nkoto motoba na ntuku minei na libwa", group: "6040-6049" },
  
    // Extend further as needed
    { value: 7000, word: "Nkoto sambo", group: "7000-7009" },
    { value: 7001, word: "Nkoto sambo na moko", group: "7000-7009" },
    { value: 7002, word: "Nkoto sambo na mibale", group: "7000-7009" },
    { value: 7003, word: "Nkoto sambo na misato", group: "7000-7009" },
    { value: 7004, word: "Nkoto sambo na minei", group: "7000-7009" },
    { value: 7005, word: "Nkoto sambo na mitano", group: "7000-7009" },
    { value: 7006, word: "Nkoto sambo na motoba", group: "7000-7009" },
    { value: 7007, word: "Nkoto sambo na sambo", group: "7000-7009" },
    { value: 7008, word: "Nkoto sambo na mwambe", group: "7000-7009" },
    { value: 7009, word: "Nkoto sambo na libwa", group: "7000-7009" },

    { value: 7010, word: "Nkoto sambo na zomi", group: "7010-7019" },
    { value: 7011, word: "Nkoto sambo na zomi na moko", group: "7010-7019" },
    { value: 7012, word: "Nkoto sambo na zomi na mibale", group: "7010-7019" },
    { value: 7013, word: "Nkoto sambo na zomi na misato", group: "7010-7019" },
    { value: 7014, word: "Nkoto sambo na zomi na minei", group: "7010-7019" },
    { value: 7015, word: "Nkoto sambo na zomi na mitano", group: "7010-7019" },
    { value: 7016, word: "Nkoto sambo na zomi na motoba", group: "7010-7019" },
    { value: 7017, word: "Nkoto sambo na zomi na sambo", group: "7010-7019" },
    { value: 7018, word: "Nkoto sambo na zomi na mwambe", group: "7010-7019" },
    { value: 7019, word: "Nkoto sambo na zomi na libwa", group: "7010-7019" },

    { value: 7020, word: "Nkoto sambo na ntuku mibale", group: "7020-7029" },
    { value: 7021, word: "Nkoto sambo na ntuku mibale na moko", group: "7020-7029" },
    { value: 7022, word: "Nkoto sambo na ntuku mibale na mibale", group: "7020-7029" },
    { value: 7023, word: "Nkoto sambo na ntuku mibale na misato", group: "7020-7029" },
    { value: 7024, word: "Nkoto sambo na ntuku mibale na minei", group: "7020-7029" },
    { value: 7025, word: "Nkoto sambo na ntuku mibale na mitano", group: "7020-7029" },
    { value: 7026, word: "Nkoto sambo na ntuku mibale na motoba", group: "7020-7029" },
    { value: 7027, word: "Nkoto sambo na ntuku mibale na sambo", group: "7020-7029" },
    { value: 7028, word: "Nkoto sambo na ntuku mibale na mwambe", group: "7020-7029" },
    { value: 7029, word: "Nkoto sambo na ntuku mibale na libwa", group: "7020-7029" },

    { value: 7030, word: "Nkoto sambo na ntuku misato", group: "7030-7039" },
    { value: 7031, word: "Nkoto sambo na ntuku misato na moko", group: "7030-7039" },
    { value: 7032, word: "Nkoto sambo na ntuku misato na mibale", group: "7030-7039" },
    { value: 7033, word: "Nkoto sambo na ntuku misato na misato", group: "7030-7039" },
    { value: 7034, word: "Nkoto sambo na ntuku misato na minei", group: "7030-7039" },
    { value: 7035, word: "Nkoto sambo na ntuku misato na mitano", group: "7030-7039" },
    { value: 7036, word: "Nkoto sambo na ntuku misato na motoba", group: "7030-7039" },
    { value: 7037, word: "Nkoto sambo na ntuku misato na sambo", group: "7030-7039" },
    { value: 7038, word: "Nkoto sambo na ntuku misato na mwambe", group: "7030-7039" },
    { value: 7039, word: "Nkoto sambo na ntuku misato na libwa", group: "7030-7039" },

    // Extend further as needed
    { value: 8000, word: "Nkoto mwambe", group: "8000-8009" },
    { value: 8001, word: "Nkoto mwambe na moko", group: "8000-8009" },
    { value: 8002, word: "Nkoto mwambe na mibale", group: "8000-8009" },
    { value: 8003, word: "Nkoto mwambe na misato", group: "8000-8009" },
    { value: 8004, word: "Nkoto mwambe na minei", group: "8000-8009" },
    { value: 8005, word: "Nkoto mwambe na mitano", group: "8000-8009" },
    { value: 8006, word: "Nkoto mwambe na motoba", group: "8000-8009" },
    { value: 8007, word: "Nkoto mwambe na sambo", group: "8000-8009" },
    { value: 8008, word: "Nkoto mwambe na mwambe", group: "8000-8009" },
    { value: 8009, word: "Nkoto mwambe na libwa", group: "8000-8009" },
    // Extend further as needed
    { value: 9000, word: "Nkoto libwa", group: "9000-9009" },
    { value: 9001, word: "Nkoto libwa na moko", group: "9000-9009" },
    { value: 9002, word: "Nkoto libwa na mibale", group: "9000-9009" },
    { value: 9003, word: "Nkoto libwa na misato", group: "9000-9009" },
    { value: 9004, word: "Nkoto libwa na minei", group: "9000-9009" },
    { value: 9005, word: "Nkoto libwa na mitano", group: "9000-9009" },
    { value: 9006, word: "Nkoto libwa na motoba", group: "9000-9009" },
    { value: 9007, word: "Nkoto libwa na sambo", group: "9000-9009" },
    { value: 9008, word: "Nkoto libwa na mwambe", group: "9000-9009" },
    { value: 9009, word: "Nkoto libwa na libwa", group: "9000-9009" },
    // Extend further as needed
    { value: 10000, word: "Mokoko", group: "10000-10009" },
    { value: 10001, word: "Mokoko moko na moko", group: "10000-10009" },
    { value: 10002, word: "Mokoko moko na mibale", group: "10000-10009" },
    { value: 10003, word: "Mokoko moko na misato", group: "10000-10009" },
    { value: 10004, word: "Mokoko moko na minei", group: "10000-10009" },
    { value: 10005, word: "Mokoko moko na mitano", group: "10000-10009" },
    { value: 10006, word: "Mokoko moko na motoba", group: "10000-10009" },
    { value: 10007, word: "Mokoko moko na sambo", group: "10000-10009" },
    { value: 10008, word: "Mokoko moko na mwambe", group: "10000-10009" },
    { value: 10009, word: "Mokoko moko na libwa", group: "10000-10009" },

    { value: 10010, word: "Mokoko moko na zomi", group: "10010-10019" },

    { value: 20000, word: "Mokoko mibale", group: "20000+" },
    { value: 30000, word: "Mokoko misato", group: "30000+" },
    { value: 40000, word: "Mokoko minei", group: "40000+" },
    { value: 50000, word: "Mokoko mitano", group: "50000+" },
    { value: 60000, word: "Mokoko motoba", group: "60000+" },
    { value: 70000, word: "Mokoko sambo", group: "70000+" },
    { value: 80000, word: "Mokoko mwambe", group: "80000+" },
    { value: 90000, word: "Mokoko libwa", group: "90000+" },

    { value: 100000, word: "Elundu", group: "100000+" },
    { value: 200000, word: "Elundu mibale", group: "200000+" },
    { value: 300000, word: "Elundu misato", group: "300000+" },
    { value: 400000, word: "Elundu minei", group: "400000+" },
    { value: 500000, word: "Elundu mitano", group: "500000+" },
    { value: 600000, word: "Elundu motoba", group: "600000+" },
    { value: 700000, word: "Elundu sambo", group: "700000+" },
    { value: 800000, word: "Elundu mwambe", group: "800000+" },
    { value: 900000, word: "Elundu libwa", group: "900000+" },
    // Extend further as needed
    { value: 1000000, word: "Efuku", group: "1000000-1000009" },

    { value: 2000000, word: "Efuku mibale", group: "2000000-2000009" },

    { value: 3000000, word: "Efuku misato", group: "3000000-3000009" },

    { value: 4000000, word: "Efuku minei", group: "4000000+" },
    { value: 5000000, word: "Efuku mitano", group: "5000000+" },
    { value: 6000000, word: "Efuku motoba", group: "6000000+" },
    { value: 7000000, word: "Efuku sambo", group: "7000000+" },
    { value: 8000000, word: "Efuku mwambe", group: "8000000+" },
    { value: 9000000, word: "Efuku libwa", group: "9000000+" },
    // Extend further as needed
    { value: 10000000, word: "Mosambo", group: "10000000-10000009" },

    { value: 20000000, word: "Mosambo mibale", group: "20000000-20000009" },

    { value: 30000000, word: "Mosambo misato", group: "30000000-30000009" },

    { value: 40000000, word: "Mosambo minei", group: "40000000-40000009" },

    { value: 50000000, word: "Mosambo mitano", group: "50000000-50000009" },

    { value: 60000000, word: "Mosambo motoba", group: "60000000-60000009" },

    { value: 70000000, word: "Mosambo sambo", group: "70000000-70000009" },

    { value: 80000000, word: "Mosambo mwambe", group: "80000000-80000009" },

    { value: 90000000, word: "Mosambo libwa", group: "90000000-90000009" },
    
    { value: 90000010, word: "Mosambo libwa na zomi", group: "90000010-90000019" },
    
    { value: 90000020, word: "Mosambo libwa na ntuku mibale", group: "90000020-90000029" },

    { value: 90000030, word: "Mosambo libwa na ntuku misato", group: "90000030-90000039" },

    { value: 90000040, word: "Mosambo libwa na ntuku minei", group: "90000040-90000049" },

    { value: 90000050, word: "Mosambo libwa na ntuku mitano", group: "90000050-90000059" },

    { value: 90000060, word: "Mosambo libwa na ntuku motoba", group: "90000060-90000069" },
    
    { value: 90000070, word: "Mosambo libwa na ntuku sambo", group: "90000070-90000079" },
    
    { value: 90000080, word: "Mosambo libwa na ntuku mwambe", group: "90000080-90000089" },

    { value: 90000090, word: "Mosambo libwa na ntuku libwa", group: "90000090-90000099" },

    { value: 900000100, word: "Mosambo libwa na nkama", group: "90000100-90000109" },

    { value: 900000110, word: "Mosambo libwa na nkama na zomi", group: "90000110-90000119" },

    { value: 900000120, word: "Mosambo libwa na nkama na ntuku mibale", group: "90000120-90000129" },
    { value: 900000121, word: "Mosambo libwa na nkama na ntuku mibale na moko", group: "90000120-90000129" },
    { value: 900000122, word: "Mosambo libwa na nkama na ntuku mibale na mibale", group: "90000120-90000129" },
    { value: 900000123, word: "Mosambo libwa na nkama na ntuku mibale na misato", group: "90000120-90000129" },
    { value: 900000124, word: "Mosambo libwa na nkama na ntuku mibale na minei", group: "90000120-90000129" },
    { value: 900000125, word: "Mosambo libwa na nkama na ntuku mibale na mitano", group: "90000120-90000129" },
    { value: 900000126, word: "Mosambo libwa na nkama na ntuku mibale na motoba", group: "90000120-90000129" },
    { value: 900000127, word: "Mosambo libwa na nkama na ntuku mibale na sambo", group: "90000120-90000129" },
    { value: 900000128, word: "Mosambo libwa na nkama na ntuku mibale na mwambe", group: "90000120-90000129" },
    // Extend further as needed

];

// Fast O(1) lookup
const customMap = new Map(customWords.map(o => [o.value, o]));

function getGroupForValue(value) {
  const start = Math. floor(value / 10) * 10;
  const end = start + 9;
  return `${start}-${end}`;
}

// If you need the full 1M array (memory-heavy! ):
export const numbers = Array. from({ length: 1_000_000 }, (_, i) => {
  const found = customMap.get(i); // O(1) instead of O(n)
  return {
    value: i,
    word: found ? found.word : i.toString(),
    group: found ?  found.group : getGroupForValue(i),
    mentioned: !!found
  };
});

// Export helpers for chunked/lazy access (recommended for large datasets)
export function getGroupForValueFn(value) {
  return getGroupForValue(value);
}

export const _internal_customWords = customWords;
export const _internal_customMap = customMap;