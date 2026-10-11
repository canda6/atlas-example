package room

const Size = 15

func winning(board []uint32, x, y int, stone uint32) bool {
	for _, d := range [][2]int{{1, 0}, {0, 1}, {1, 1}, {1, -1}} {
		n := 1
		for _, sign := range []int{-1, 1} {
			for step := 1; step < Size; step++ {
				xx, yy := x+sign*step*d[0], y+sign*step*d[1]
				if xx < 0 || xx >= Size || yy < 0 || yy >= Size || board[yy*Size+xx] != stone {
					break
				}
				n++
			}
		}
		if n >= 5 {
			return true
		}
	}
	return false
}
