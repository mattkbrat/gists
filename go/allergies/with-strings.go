package allergies

import (
	"fmt"
	"slices"
	"strings"
)

var allergens = []string{
	"eggs",
	"peanuts",
	"shellfish",
	"strawberries",
	"tomatoes",
	"chocolate",
	"pollen",
	"cats",
}

var nums = []uint{
	1,
	2,
	4,
	8,
	16,
	32,
	64,
	128,
}

var total_allergens = len(allergens)

func Allergies(allergies uint) []string {
	var result []string

	if allergies == 0 {
		return result
	}

	// convert int to binary so to find the flipped bits
	binary_str := fmt.Sprintf("%b", allergies)
	binary := strings.Split(binary_str, "")

	// iterate backwards through the binary, and find the matching bits.
	// compare matching to list of allergens.
	for i := range allergens {
		if binary[i] != "1" {
			continue
		}

		allergen_index := len(binary) - i - 1

		if total_allergens-1 < allergen_index {
			// Valid but unknown allergen
			continue
		}

		result = append(result, allergens[allergen_index])
	}

	return result
}

func AllergicTo(allergies uint, allergen string) bool {
	allergens := Allergies(allergies)

	return slices.Contains(allergens, allergen)
}
