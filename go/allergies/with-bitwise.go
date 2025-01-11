package allergies

var allergens = map[string]uint{
	"eggs":         1,
	"peanuts":      2,
	"shellfish":    4,
	"strawberries": 8,
	"tomatoes":     16,
	"chocolate":    32,
	"pollen":       64,
	"cats":         128,
}

func Allergies(allergies uint) []string {
	var result []string

	if allergies == 0 {
		return result
	}

	for allergen, points := range allergens {
		if allergies&points == 0 {
			continue
		}

		result = append(result, allergen)
	}

	return result
}

func AllergicTo(allergies uint, allergen string) bool {
	points, contains := allergens[allergen]
	return contains && allergies&points != 0
}
