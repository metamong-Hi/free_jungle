
export const postData = [
    // Front Wall
    ...Array.from({ length: 4 }, (_, i) => ({
        imgSrc:`newjeans${i+1}`,
      width: 5, 
      height: 3,
      position: { x: -15 + 10 * i, y: 7, z: -19.5 }, 
      rotationY: 0, 
      info: {
        title: `newjeans${i + 1}`,
        author: 'metamong',
        description: `test ${
          i + 1
        } testtest`,
        year: `Year ${i + 1}`,
      },
    })),
    // Back Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      imgSrc: `newjeans${i + 5}`,
      width: 5,
      height: 3,
      position: { x: -15 + 10 * i, y: 7, z: 19.5 },
      rotationY: Math.PI,
      info: {
        title: `newjeans${i + 5}`,
        artist: 'metamong',
        description: `tes ${
          i + 5
        } testtest`,
        year: `Year ${i + 5}`,
      },
    })),
    // Left Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      imgSrc: `newjeans${i + 9}`,
      width: 5,
      height: 3,
      position: { x: -19.5, y: 7, z: -15 + 10 * i },
      rotationY: Math.PI / 2,
      info: {
        title: `newjeans${i + 9}`,
        artist: 'metamong',
        description: `tes ${
          i + 9
        } testtest`,
        year: `Year ${i + 9}`,
      },
    })),
    // Right Wall
    ...Array.from({ length: 3 }, (_, i) => ({
      imgSrc: `newjeans${i + 13}`,
      width: 5,
      height: 3,
      position: { x: 19.5, y: 7, z: -15 + 10 * i },
      rotationY: -Math.PI / 2,
      info: {
        title: `newjeans${i + 13}`,
        artist: 'metamong',
        description: `tes ${
          i + 13
        } testtest`,
        year: `Year ${i + 13}`,
      },
    })),
  ];