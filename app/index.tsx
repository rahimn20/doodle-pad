import MovableElement from "@/components/MovableElement";
import Toolbar from "@/components/Toolbar";
import { COLORS } from "@/constants";
import db from "@/db";
import { ElementType, SketchElement } from "@/types";
import { id } from "@instantdb/react-native";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");

export default function Index() {
  const { data } = db.useQuery({
    elements: {},
  });

  const elements = data?.elements || [];

  const [selectedTool, setSelectedTool] = useState<ElementType>("circle");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  const addElement = (x: number, y: number) => {
    const elementId = id();
    let width = 60;
    let height = 60;

    if (selectedTool === "rectangle") {
      width = 80;
      height = 60;
    } else if (selectedTool === "star" || selectedTool === "hexagon") {
      width = 70;
      height = 70;
    }

    db.transact(
      db.tx.elements[elementId].update({
        type: selectedTool,
        x,
        y,
        width,
        height,
        color: selectedColor,
        createdAt: Date.now(),
      })
    );

    setSelectedElementId(elementId);
  };

  const moveElement = (elementId: string, x: number, y: number) => {
    db.transact(db.tx.elements[elementId].update({ x, y }));
  };

  const selectElement = (id: string) => {
    setSelectedElementId(id);
  };

  const clearCanvas = () => {
    if (elements.length > 0) {
      const elementIds = elements.map((el: any) => el.id);
      db.transact(
        elementIds.map((elementId: string) =>
          db.tx.elements[elementId].delete()
        )
      );
    }
    setSelectedElementId(null);
  };

  const canvasTapGesture = Gesture.Tap().onEnd((event) => {
    if (event.y < screenHeight - 120) {
      runOnJS(addElement)(event.x, event.y);
    }
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={canvasTapGesture}>
        <View style={styles.canvas}>
          {elements.map((element) => (
            <MovableElement
              key={element.id}
              element={element as SketchElement}
              onMove={moveElement}
              onSelect={selectElement}
              isSelected={element.id === selectedElementId}
            />
          ))}
        </View>
      </GestureDetector>

      <Toolbar
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        onToolSelect={setSelectedTool}
        onColorSelect={setSelectedColor}
        onClearCanvas={clearCanvas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  canvas: {
    flex: 1,
    position: "relative",
  },
});
