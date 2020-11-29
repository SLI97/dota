// import GameBoard from './MyClass/GameBoard'

// const BOARD_GUTTER = 12;
// const CELL_SIZE = 60;

// const styles = {
//   tile2: {
//     backgroundColor: 'none',
//   },
//   tile2: {
//     backgroundColor: '#eeeeee',
//   },
//   tile4: {
//     backgroundColor: '#eeeecc',
//   },
//   tile8: {
//     backgroundColor: '#ffbb88',
//   },
//   tile16: {
//     backgroundColor: '#ff9966',
//   },
//   tile32: {
//     backgroundColor: '#ff7755',
//   },
//   tile64: {
//     backgroundColor: '#ff5533',
//   },
//   tile128: {
//     backgroundColor: '#eecc77',
//   },
//   tile256: {
//     backgroundColor: '#eecc66',
//   },
//   tile512: {
//     backgroundColor: '#eecc55',
//   },
//   tile1024: {
//     backgroundColor: '#eecc33',
//   },
//   tile2048: {
//     backgroundColor: '#eecc22',
//   },
//   whiteText: {
//     color: '#ffffff',
//   },
// }

// let startX = 0,
//   unitFormat = 1,
//   startY = 0,
//   board = null



// const getPageXY = (event) => {
//   return {
//     pageX: event.changedTouches[0].pageX,
//     pageY: event.changedTouches[0].pageY
//   }
// }

// Page({
//   data: {
//     tiles: [],
//     message: 'Game Oever',
//     showOverlay: false,
//   },
//   onLoad() {
//     // this.adapter()
//   },
//   onReady() {
//     this.restart()
//   },
//   adapter() {
//     const systemInfo = wx.getSystemInfoSync();
//     unitFormat = (systemInfo.windowWidth / 750).toFixed(4);
//   },
//   restart() {
//     board = new GameBoard()
//     this.calculate()
//   },
//   calculate() {
//     const arr = board.tiles.filter((tile) => tile.value)

//     const result = arr.map(i => {
//       const fontSize = i.value > 1000 ?
//         36 : i.value > 100 ?
//         40 : i.value > 4 ?
//         44 : 48

//       const animation = wx.createAnimation({
//         duration: 100,
//         timingFunction: 'linear',
//       })
//       const isMerge = arr.some(e => e.mergedInto && e.mergedInto.id === i.id)

//       if (i.isNew()) {
//         // animation
//         //   .opacity(1)
//         //   .step()
//       } else {
//         animation
//           .top(this.getPosition(i.toRow()))
//           .left(this.getPosition(i.toColumn()))
//           .opacity(1)
//           .step()
//       }
//       if (isMerge) {
//         animation
//           .scale(1.6, 1.6)
//           .step()
//         animation
//           .scale(1, 1)
//           .step()
//       }

//       return Object.assign({}, i, {
//         animation: animation.export(),
//         fontSize,
//         bgColor: styles['tile' + i.value] ? styles['tile' + i.value].backgroundColor : 'none',
//         color: i.value > 4 ? '#fff' : '#776666',
//         top: this.getPosition(i.toRow()),
//         left: this.getPosition(i.toColumn()),
//         opacity: 0,
//       })
//     })

//     this.setData({
//       tiles: result,
//       showOverlay: board.hasWon() || board.hasLost(),
//       message: board.hasWon() ? 'Good Job!' : 'Game Over'
//     }, () => {
//       this.data.tiles.forEach((i, index) => {
//         const tileItem = arr.find(e => e.id === i.id)
//         if (tileItem && tileItem.isNew()) {
//           const animation = wx.createAnimation({
//             duration: 100,
//             timingFunction: 'linear',
//           })
//           animation
//             .opacity(1)
//             .step()
//           const item = `tiles[${index}].animation`
//           this.setData({
//             [item]: animation.export(),
//           })
//         }
//       })
//     })
//   },
//   getPosition(index) {
//     return (BOARD_GUTTER + CELL_SIZE) * (index) + BOARD_GUTTER
//   },
//   touchstart(event) {
//     if (board.hasWon()) {
//       return;
//     }

//     const touch = getPageXY(event);
//     startX = touch.pageX;
//     startY = touch.pageY;

//   },
//   touchend(event) {

//     if (board.hasWon()) {
//       return;
//     }

//     const touch = getPageXY(event);
//     const deltaX = touch.pageX - startX;
//     const deltaY = touch.pageY - startY;

//     let direction = -1;
//     if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
//       direction = deltaX > 0 ? 2 : 0;
//     } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
//       direction = deltaY > 0 ? 3 : 1;
//     }

//     if (direction !== -1) {
//       board = board.move(direction)
//       this.calculate()
//     }
//   }
// })