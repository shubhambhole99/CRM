// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path';
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   esbuild: {
//     loader: "jsx",
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         ".js": "jsx",
//       },
//     },
//   },
//   define: {
//     global: 'window'
//   },
//   // resolve:{
//   //   alias:{
//   //     '@components': path.resolve(__dirname, 'src/components'),
//   //     '@assets':path.resolve(__dirname, 'src/assets'),
//   //     '@constants':path.resolve(__dirname, 'src/constants'),
//   //     '@utils':path.resolve(__dirname, 'src/utils'),
//   //     '@src':path.resolve(__dirname, 'src')
//   //   }
//   // },
//   // build: {
//   //   commonjsOptions: { include: [] },
//   // },
//   // optimizeDeps: {
//   //   disabled: false,
//   // },
// });
//   // optimizeDeps: {
//   //   esbuildOptions: {
//   //     define: {
//   //       global: 'globalThis'
//   //     }
//   //   }
//   // }
