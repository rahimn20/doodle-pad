import { COLORS } from "@/constants";
import { ElementType } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ToolbarProps {
  selectedTool: ElementType;
  selectedColor: string;
  onToolSelect: (tool: ElementType) => void;
  onColorSelect: (color: string) => void;
  onClearCanvas: () => void;
}

export default function Toolbar({
  selectedTool,
  selectedColor,
  onToolSelect,
  onColorSelect,
  onClearCanvas,
}: ToolbarProps) {
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

  return (
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
                onToolSelect(tool as ElementType);
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
          onPress={onClearCanvas}
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
                onColorSelect(color);
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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