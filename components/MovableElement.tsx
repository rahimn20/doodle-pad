import { SketchElement } from "@/types";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface MovableElementProps {
  element: SketchElement;
  onMove: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function MovableElement({
  element,
  onMove,
  onSelect,
  isSelected,
}: MovableElementProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Reset translate values when element position changes from database
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [element.x, element.y, translateX, translateY]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1);
      runOnJS(onSelect)(element.id);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      const finalX = element.x + event.translationX;
      const finalY = element.y + event.translationY;
      runOnJS(onMove)(element.id, finalX, finalY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: element.x + translateX.value },
      { translateY: element.y + translateY.value },
      { scale: scale.value },
    ],
  }));

  const renderElement = () => {
    switch (element.type) {
      case "rectangle":
        return (
          <View
            style={[
              styles.rectangleElement,
              {
                backgroundColor: element.color,
                width: element.width || 80,
                height: element.height || 60,
              },
            ]}
          />
        );
      case "circle":
        return (
          <View
            style={[
              styles.circleElement,
              {
                backgroundColor: element.color,
                width: element.width || 60,
                height: element.height || 60,
              },
            ]}
          />
        );
      case "triangle":
        return (
          <View
            style={[
              styles.triangleElement,
              {
                borderBottomColor: element.color,
                borderBottomWidth: element.height || 60,
                borderLeftWidth: (element.width || 60) / 2,
                borderRightWidth: (element.width || 60) / 2,
              },
            ]}
          />
        );
      case "diamond":
        return (
          <View
            style={[
              styles.diamondElement,
              {
                backgroundColor: element.color,
                width: element.width || 60,
                height: element.height || 60,
              },
            ]}
          />
        );
      case "star":
        return (
          <View style={styles.starContainer}>
            <Text
              style={[
                styles.starElement,
                {
                  color: element.color,
                  fontSize: (element.width || 70) * 0.8,
                },
              ]}
            >
              ★
            </Text>
          </View>
        );
      case "hexagon":
        return (
          <View style={styles.hexagonContainer}>
            <Text
              style={[
                styles.hexagonElement,
                {
                  color: element.color,
                  fontSize: (element.width || 70) * 0.7,
                },
              ]}
            >
              ⬡
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          animatedStyle,
          styles.elementContainer,
          isSelected && styles.selectedElement,
        ]}
      >
        {renderElement()}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  elementContainer: {
    position: "absolute",
    padding: 6,
  },
  selectedElement: {
    borderWidth: 2,
    borderColor: "#6366F1",
    borderStyle: "dashed",
    borderRadius: 8,
    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
  },
  rectangleElement: {
    borderRadius: 8,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  circleElement: {
    borderRadius: 100,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  triangleElement: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  diamondElement: {
    transform: [{ rotate: "45deg" }],
    borderRadius: 4,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  },
  starContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  starElement: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hexagonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  hexagonElement: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
