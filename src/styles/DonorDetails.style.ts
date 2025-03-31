import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  typeButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#E6F4FF',
    borderColor: '#0096FF',
    borderWidth: 1,
  },
  typeLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  selectedTypeLabel: {
    color: '#0096FF',
    fontWeight: '500',
  },
});