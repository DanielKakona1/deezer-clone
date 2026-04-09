import '@testing-library/jest-native/extend-expect';

const jestGlobal = (
  globalThis as unknown as {
    jest?: {
      mock: (moduleName: string) => void;
    };
  }
).jest;

jestGlobal?.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
