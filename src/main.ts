import "#app/polyfills"; // All polyfills MUST be loaded first for side effects
import "#init/init-manifest"; // initializes the manifest, must be done *before* i18n is initialized due to being used for caching
import "#app/i18n"; // Initializes i18n on import

import { InvertPostFX } from "#app/pipelines/invert";
import { isBeta, isDev } from "#constants/app-constants";
import { version } from "#package.json";
import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import TransitionImagePackPlugin from "phaser3-rex-plugins/templates/transitionimagepack/transitionimagepack-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

if (isBeta || isDev) {
  document.title += " (Beta)";
}

async function startGame(): Promise<void> {
  const LoadingScene = (await import("./loading-scene")).LoadingScene;
  const BattleScene = (await import("./battle-scene")).BattleScene;
  const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: "app",
    scale: {
      width: 1920,
      height: 1080,
      mode: Phaser.Scale.FIT,
    },
    plugins: {
      global: [
        {
          key: "rexInputTextPlugin",
          plugin: InputTextPlugin,
          start: true,
        },
        {
          key: "rexBBCodeTextPlugin",
          plugin: BBCodeTextPlugin,
          start: true,
        },
        {
          key: "rexTransitionImagePackPlugin",
          plugin: TransitionImagePackPlugin,
          start: true,
        },
      ],
      scene: [
        {
          key: "rexUI",
          plugin: UIPlugin,
          mapping: "rexUI",
        },
      ],
    },
    input: {
      mouse: {
        target: "app",
      },
      touch: {
        target: "app",
      },
      gamepad: true,
    },
    dom: {
      createContainer: true,
    },
    antialias: false,
    pipeline: [InvertPostFX] as unknown as Phaser.Types.Core.PipelineConfig,
    scene: [LoadingScene, BattleScene],
    version,
  });
  game.sound.pauseOnBlur = false;

  // [MOD] 안드로이드(Capacitor) 웹뷰에서 앱 최초 실행 시 실제 화면 크기를
  // 잘못 인식해서 캔버스가 작게 잡히는 문제 대응.
  const forceRescale = () => {
    game.scale.refresh();
  };
  setTimeout(forceRescale, 300);
  setTimeout(forceRescale, 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      forceRescale();
    }
  });

  // [MOD] 세로 모드: 비율 유지(FIT, 여백 생김) / 가로 모드: 화면 꽉 채우기(ENVELOP, 살짝 잘림)
  const updateScaleModeForOrientation = () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    game.scale.setMode(isLandscape ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT);
    forceRescale();
  };
  updateScaleModeForOrientation();
  window.addEventListener("resize", updateScaleModeForOrientation);
  window.addEventListener("orientationchange", () => {
    setTimeout(updateScaleModeForOrientation, 300);
  });
  // 안드로이드 웹뷰에서는 resize/orientationchange 이벤트가 안 터지는 경우가 있어
  // 실제 화면 크기 변화를 직접 감시하는 방식도 같이 사용
  if (typeof ResizeObserver !== "undefined") {
    let lastWasLandscape = window.innerWidth > window.innerHeight;
    const observer = new ResizeObserver(() => {
      const isLandscapeNow = window.innerWidth > window.innerHeight;
      if (isLandscapeNow !== lastWasLandscape) {
        lastWasLandscape = isLandscapeNow;
        updateScaleModeForOrientation();
      }
    });
    observer.observe(document.documentElement);
  }
  if (typeof screen !== "undefined" && screen.orientation) {
    screen.orientation.addEventListener("change", () => {
      setTimeout(updateScaleModeForOrientation, 300);
    });
  }
}

try {
  await Promise.all([document.fonts.load("16px emerald"), document.fonts.load("10px pkmnems")]);
} catch (err) {
  console.error("Error loading fonts:", err);
} finally {
  await startGame();
}
