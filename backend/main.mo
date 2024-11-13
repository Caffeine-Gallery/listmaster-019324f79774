import Bool "mo:base/Bool";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
    // Item type definition
    public type ShoppingItem = {
        id: Nat;
        text: Text;
        completed: Bool;
    };

    private stable var nextId: Nat = 0;
    private stable var itemEntries: [(Nat, ShoppingItem)] = [];

    // Initialize HashMap with stable data
    private var items = HashMap.HashMap<Nat, ShoppingItem>(
        10,
        Nat.equal,
        Hash.hash,
    );

    system func preupgrade() {
        itemEntries := Iter.toArray(items.entries());
    };

    system func postupgrade() {
        items := HashMap.fromIter<Nat, ShoppingItem>(
            itemEntries.vals(),
            10,
            Nat.equal,
            Hash.hash,
        );
        itemEntries := [];
    };

    // Add a new shopping item
    public func addItem(text: Text) : async ShoppingItem {
        let item: ShoppingItem = {
            id = nextId;
            text = text;
            completed = false;
        };
        items.put(nextId, item);
        nextId += 1;
        return item;
    };

    // Get all items
    public query func getItems() : async [ShoppingItem] {
        Iter.toArray(items.vals())
    };

    // Toggle item completion status
    public func toggleItem(id: Nat) : async ?ShoppingItem {
        switch (items.get(id)) {
            case (null) { null };
            case (?item) {
                let updatedItem: ShoppingItem = {
                    id = item.id;
                    text = item.text;
                    completed = not item.completed;
                };
                items.put(id, updatedItem);
                ?updatedItem
            };
        }
    };

    // Delete an item
    public func deleteItem(id: Nat) : async Bool {
        switch (items.remove(id)) {
            case (null) { false };
            case (?_) { true };
        }
    };
}
