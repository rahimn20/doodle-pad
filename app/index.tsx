import MovableElement from "@/components/MovableElement";
import { COLORS } from "@/constants";
import db from "@/db";
import { ElementType, SketchElement } from "@/types";
import { id } from "@instantdb/react-native";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case "circle":
        return "●";
      case "rectangle":
        return "▭";
      case "triangle":
        return "▲";
      case "diamond":
        return "◆";
      case "star":
        return "★";
      case "hexagon":
        return "⬡";
      default:
        return "●";
    }
  };

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

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.topRow}>
          <View style={styles.toolButtons}>
            {(
              [
                "circle",
                "rectangle",
                "triangle",
                "diamond",
                "star",
                "hexagon",
              ] as const
            ).map((tool) => (
              <TouchableOpacity
                key={tool}
                style={[
                  styles.toolButton,
                  selectedTool === tool && styles.selectedTool,
                  selectedTool === tool && {
                    backgroundColor: selectedColor,
                  },
                ]}
                onPress={() => {
                  setSelectedTool(tool as ElementType);
                }}
              >
                <Text
                  style={[
                    styles.toolButtonText,
                    selectedTool === tool && styles.selectedToolText,
                  ]}
                >
                  {getToolIcon(tool)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              clearCanvas();
            }}
          >
            <Text style={styles.clearButtonText}>x</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colorRow}>
          <View style={styles.colorPalette}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                activeOpacity={0.8}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                  },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => {
                  setSelectedColor(color);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  toolbar: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF95",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  toolButtons: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 6,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  toolButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6B7280",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  canvas: {
    flex: 1,
    position: "relative",
  },
  clearButton: {
    width: 44,
    height: 44,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px 0 rgba(239, 68, 68, 0.3)",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  colorPalette: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 8,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "transparent",
    boxShadow: "0 2px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  selectedColor: {
    borderColor: "#FFFFFF",
    borderWidth: 4,
    boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.2)",
    transform: [{ scale: 1.1 }],
  },
  selectedTool: {
    backgroundColor: "#6366F1",
    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.3)",
  },
  selectedToolText: {
    color: "#FFFFFF",
  },
});
